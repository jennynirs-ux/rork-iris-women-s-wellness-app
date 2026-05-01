import { z } from 'zod';
import { publicProcedure } from '@/backend/trpc/create-context';
import { sha256 } from '@/lib/crypto';
import { loadAsync, saveAsync } from '../persistence';
import crypto from 'crypto';

/**
 * Server-side admin credentials (moved from client bundle).
 * Password hashes loaded from environment variables (ADMIN_HASH_SUPER, ADMIN_HASH_ANALYST, ADMIN_HASH_VIEWER)
 */
const ADMIN_CREDENTIALS: Record<
  string,
  { passwordHash: string; role: 'super_admin' | 'analyst' | 'viewer' }
> = {
  admin: {
    passwordHash:
      process.env.ADMIN_HASH_SUPER || '',
    role: 'super_admin',
  },
  analyst: {
    passwordHash:
      process.env.ADMIN_HASH_ANALYST || '',
    role: 'analyst',
  },
  viewer: {
    passwordHash:
      process.env.ADMIN_HASH_VIEWER || '',
    role: 'viewer',
  },
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ['view_users', 'view_revenue', 'view_features', 'export_data', 'manage_roles'],
  analyst: ['view_users', 'view_features', 'export_data'],
  viewer: ['view_users', 'view_features'],
};

interface AdminSession {
  token: string;
  username: string;
  role: 'super_admin' | 'analyst' | 'viewer';
  permissions: string[];
  createdAt: number;
  expiresAt: number;
}

interface AdminSessionsFile {
  sessions: Record<string, AdminSession>;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const SESSIONS_FILE = 'admin-sessions.json';

/**
 * Load all admin sessions from persistent storage
 */
async function loadSessions(): Promise<AdminSessionsFile> {
  const data = await loadAsync<AdminSessionsFile>(SESSIONS_FILE);
  return data || { sessions: {} };
}

/**
 * Save admin sessions to persistent storage
 */
async function saveSessions(data: AdminSessionsFile): Promise<void> {
  await saveAsync<AdminSessionsFile>(SESSIONS_FILE, data);
}

/**
 * Generate a cryptographically secure random token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a new session for a logged-in user
 */
function createSession(
  username: string,
  role: 'super_admin' | 'analyst' | 'viewer'
): AdminSession {
  const now = Date.now();
  return {
    token: generateToken(),
    username,
    role,
    permissions: (ROLE_PERMISSIONS[role] || []) as string[],
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
}

/**
 * Admin login endpoint
 * Input: { username, password }
 * Returns: { success, token, role } or throws error
 */
export default publicProcedure
  .input(
    z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    })
  )
  .mutation(async ({ input }) => {
    const { username, password } = input;
    const lowerUsername = username.toLowerCase();

    // Validate credentials exist
    const cred = ADMIN_CREDENTIALS[lowerUsername];
    if (!cred) {
      throw new Error('Invalid credentials');
    }

    // Hash input password and compare
    const inputHash = await sha256(password);
    if (inputHash !== cred.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // Create session
    const session = createSession(lowerUsername, cred.role);

    // Persist session
    const sessionData = await loadSessions();
    sessionData.sessions[session.token] = session;
    await saveSessions(sessionData);

    return {
      success: true,
      token: session.token,
      role: session.role,
    };
  });

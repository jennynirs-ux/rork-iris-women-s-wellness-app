import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { sha256 } from '../../../../lib/crypto';
import { load, save } from '../../persistence';
import crypto from 'crypto';

const ADMIN_CREDENTIALS: Record<
  string,
  { passwordHash: string; role: 'super_admin' | 'analyst' | 'viewer' }
> = {
  admin: {
    passwordHash: process.env.ADMIN_HASH_SUPER || '',
    role: 'super_admin',
  },
  analyst: {
    passwordHash: process.env.ADMIN_HASH_ANALYST || '',
    role: 'analyst',
  },
  viewer: {
    passwordHash: process.env.ADMIN_HASH_VIEWER || '',
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

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
const SESSIONS_FILE = 'admin-sessions.json';

function loadSessions(): AdminSessionsFile {
  const data = load<AdminSessionsFile>(SESSIONS_FILE);
  return data || { sessions: {} };
}

function saveSessions(data: AdminSessionsFile): void {
  save<AdminSessionsFile>(SESSIONS_FILE, data);
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

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

    const cred = ADMIN_CREDENTIALS[lowerUsername];
    if (!cred) {
      throw new Error('Invalid credentials');
    }

    const inputHash = await sha256(password);
    if (inputHash !== cred.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const session = createSession(lowerUsername, cred.role);

    const sessionData = loadSessions();
    sessionData.sessions[session.token] = session;
    saveSessions(sessionData);

    return {
      success: true,
      token: session.token,
      role: session.role,
    };
  });

import { z } from 'zod';
import { publicProcedure } from '@/backend/trpc/create-context';
import { load } from '../persistence';

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

const SESSIONS_FILE = 'admin-sessions.json';

/**
 * Load all admin sessions from persistent storage
 */
function loadSessions(): AdminSessionsFile {
  const data = load<AdminSessionsFile>(SESSIONS_FILE);
  return data || { sessions: {} };
}

/**
 * Admin verify endpoint
 * Input: { token }
 * Returns: { valid, role, username, permissions } or { valid: false }
 */
export default publicProcedure
  .input(
    z.object({
      token: z.string().min(1),
    })
  )
  .query(({ input }) => {
    const { token } = input;

    // Load sessions
    const sessionData = loadSessions();
    const session = sessionData.sessions[token];

    // Check if session exists and hasn't expired
    if (!session) {
      return { valid: false };
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      // Session expired, clean it up
      delete sessionData.sessions[token];
      return { valid: false };
    }

    // Session is valid
    return {
      valid: true,
      role: session.role,
      username: session.username,
      permissions: session.permissions,
    };
  });

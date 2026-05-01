import { z } from 'zod';
import { publicProcedure } from '@/backend/trpc/create-context';
import { loadAsync } from '../persistence';

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

async function loadSessions(): Promise<AdminSessionsFile> {
  const data = await loadAsync<AdminSessionsFile>(SESSIONS_FILE);
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
  .query(async ({ input }) => {
    const { token } = input;

    const sessionData = await loadSessions();
    const session = sessionData.sessions[token];

    if (!session) return { valid: false };

    const now = Date.now();
    if (now > session.expiresAt) {
      delete sessionData.sessions[token];
      return { valid: false };
    }

    return {
      valid: true,
      role: session.role,
      username: session.username,
      permissions: session.permissions,
    };
  });

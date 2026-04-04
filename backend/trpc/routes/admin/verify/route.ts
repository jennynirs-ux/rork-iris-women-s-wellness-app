import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { load } from '../../persistence';

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

function loadSessions(): AdminSessionsFile {
  const data = load<AdminSessionsFile>(SESSIONS_FILE);
  return data || { sessions: {} };
}

export default publicProcedure
  .input(
    z.object({
      token: z.string().min(1),
    })
  )
  .query(({ input }) => {
    const { token } = input;

    const sessionData = loadSessions();
    const session = sessionData.sessions[token];

    if (!session) {
      return { valid: false };
    }

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

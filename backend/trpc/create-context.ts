import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { load } from "./routes/persistence";

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

export const createContext = async (opts: FetchCreateContextFnOptions) => {
    const authHeader = opts.req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    let adminSession: AdminSession | null = null;
    if (token) {
          const sessionData = load<AdminSessionsFile>("admin-sessions.json");
          const session = sessionData?.sessions?.[token];
          if (session && Date.now() <= session.expiresAt) {
                  adminSession = session;
          }
    }

    return {
          req: opts.req,
          adminSession,
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const isAdmin = t.middleware(({ ctx, next }) => {
    if (!ctx.adminSession) {
          throw new TRPCError({
                  code: "UNAUTHORIZED",
                  message: "Valid admin session required",
          });
    }
    return next({ ctx: { ...ctx, adminSession: ctx.adminSession } });
});

export const adminProcedure = t.procedure.use(isAdmin);

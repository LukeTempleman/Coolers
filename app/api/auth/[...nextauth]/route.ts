import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantId: { label: "Tenant ID", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Allow any credentials - bypass authentication for development
          console.log("� Bypassing authentication - accepting any credentials");
          
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Always return a valid user regardless of credentials
          return {
            id: "dev-user-001",
            email: credentials.email,
            name: "Development User",
            roles: ["admin", "user"],
            tenantId: "tenant-001",
            token: "dev-token-" + Date.now(),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.tenantId = user.tenantId;
        token.backendToken = user.token;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.roles = token.roles;
      session.user.tenantId = token.tenantId;
      session.backendToken = token.backendToken;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

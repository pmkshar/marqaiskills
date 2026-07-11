import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail, verifyPassword } from '../../../../lib/users';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await findUserByEmail(credentials.email);
        if (!user) return null;
        if (user.status === 'suspended') return null;
        
        const isValid = await verifyPassword(user, credentials.password);
        if (!isValid) return null;
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

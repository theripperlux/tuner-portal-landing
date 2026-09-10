import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const cleanEmail = credentials.email.trim();
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: cleanEmail },
              { email: cleanEmail.toLowerCase() }
            ]
          },
          include: { memberships: { include: { tenant: true } } }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        const activeMembership = user.memberships.find(m => m.membershipStatus === "active") || user.memberships[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: activeMembership?.role || "customer",
          tenantId: activeMembership?.tenantId || null,
          // "pending" is a real Tenant.status value (registration submitted,
          // awaiting approval) — using it as the "no tenant yet" fallback
          // made a brand-new user's dashboard look like they'd already
          // registered before ever touching the form. "not_started" is not
          // a real Tenant.status value; it's a client-only sentinel meaning
          // "no tenant/membership exists yet".
          tenantStatus: activeMembership?.tenant?.status || "not_started",
          tenantOnboardingStatus: activeMembership?.tenant?.onboardingStatus || "not_started",
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantStatus = (user as any).tenantStatus;
        token.tenantOnboardingStatus = (user as any).tenantOnboardingStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string | null | undefined;
        session.user.tenantStatus = token.tenantStatus as string;
        session.user.tenantOnboardingStatus = token.tenantOnboardingStatus as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

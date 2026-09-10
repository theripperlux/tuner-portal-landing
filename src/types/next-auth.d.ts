import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    tenantId?: string | null;
    tenantStatus?: string;
    tenantOnboardingStatus?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    tenantId?: string | null;
    tenantStatus?: string;
    tenantOnboardingStatus?: string;
  }
}

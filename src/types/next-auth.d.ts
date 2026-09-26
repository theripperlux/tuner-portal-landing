import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    tenantId?: string | null;
    tenantStatus?: string;
    tenantOnboardingStatus?: string;
    // UI hint only — never trust this for authorization, always re-check
    // via getPlatformAdminUser() (see src/lib/auth/platformAdmin.ts).
    isPlatformAdmin?: boolean;
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
    isPlatformAdmin?: boolean;
  }
}

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  AuthorizedDashboardContext, 
  DashboardRole, 
  TenantStatus, 
  TenantOnboardingStatus,
  DashboardPermission
} from "@/types/auth";

// We no longer strictly enforce the "role" to be in the JWT because the role comes from the Membership.
// But if it's there, we can ignore it or just keep it optional. The prompt states:
// "Der Client darf keine Tenant-ID als vertrauenswürdige Quelle bestimmen." 
// "Die Session enthält optional eine ausgewählte Tenant-ID."
export const sessionUserSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().nullable().optional(),
  // role is ignored here since it comes from the DB membership now
});

export async function getServerAuthContext(): Promise<AuthorizedDashboardContext | "REQUIRE_TENANT_SELECTION" | null> {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return null;
  }

  const parsed = sessionUserSchema.safeParse(session.user);
  if (!parsed.success) {
    console.error("Session validation failed:", parsed.error);
    return null;
  }

  const { id: userId, tenantId: requestedTenantId } = parsed.data;

  // Find the user to ensure they exist
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { memberships: { include: { tenant: true } } }
  });

  if (!user) return null;

  // Resolve the active membership
  let activeMembership = null;
  
  if (requestedTenantId) {
    // If a specific tenant is requested, find that membership
    activeMembership = user.memberships.find(m => m.tenantId === requestedTenantId);
  } else {
    // If none requested, default to the first active membership ONLY if there is exactly one
    const activeMemberships = user.memberships.filter(m => m.membershipStatus === "active");
    if (activeMemberships.length === 1) {
      activeMembership = activeMemberships[0];
    } else if (activeMemberships.length > 1) {
      return "REQUIRE_TENANT_SELECTION";
    }
  }

  if (!activeMembership) {
    // Cannot build context without a membership
    return null;
  }

  const tenant = activeMembership.tenant;
  const tenantStatus = (tenant.status as TenantStatus) || "pending";
  const tenantOnboardingStatus = (tenant.onboardingStatus as TenantOnboardingStatus) || "not_started";
  const membershipStatus = activeMembership.membershipStatus as "active" | "inactive" | "invited" | "blocked";
  const role = activeMembership.role as DashboardRole;

  const context: AuthorizedDashboardContext = {
    userId,
    tenantId: tenant.id,
    membershipId: activeMembership.id,
    customerProfileId: null, 
    locale: "de", 
    roles: [role],
    permissions: new Set<DashboardPermission>(),
    tenantStatus,
    tenantOnboardingStatus,
    membershipStatus
  };

  return context;
}

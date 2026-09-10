import { TenantStatus, TenantOnboardingStatus, DashboardRole, DashboardPermission } from "@/types/auth";

export type TenantAccessDecision = "ALLOW" | "REQUIRE_ONBOARDING" | "REQUIRE_TENANT_SELECTION" | "DENY_UNAUTHENTICATED" | "DENY_USER_INACTIVE" | "DENY_TENANT_MISMATCH" | "DENY_MEMBERSHIP_NOT_FOUND" | "DENY_MEMBERSHIP_INACTIVE" | "DENY_TENANT_INACTIVE" | "DENY_INVALID_STATUS_COMBINATION" | "DENY_UNAUTHORIZED";

export interface TenantAccessPolicyInput {
  authenticatedUserId: string;
  activeTenantId: string | null;
  requestedTenantId: string | null;
  tenantStatus: TenantStatus;
  onboardingStatus: TenantOnboardingStatus;
  roles: readonly DashboardRole[];
  permissions: ReadonlySet<DashboardPermission>;
  membershipStatus: "active" | "inactive" | "invited" | "blocked";
  hasMultipleActiveMemberships?: boolean;
}

export class TenantAccessPolicy {
  evaluate(input: TenantAccessPolicyInput): TenantAccessDecision {
    const { authenticatedUserId, activeTenantId, requestedTenantId, tenantStatus, onboardingStatus, roles, membershipStatus } = input;

    if (!authenticatedUserId) return "DENY_UNAUTHENTICATED";
    
    // If requesting a specific tenant, ensure it matches the active one
    if (requestedTenantId && activeTenantId !== requestedTenantId) return "DENY_TENANT_MISMATCH";

    // If multiple tenants but none explicitly selected/active
    if (input.hasMultipleActiveMemberships && !activeTenantId) return "REQUIRE_TENANT_SELECTION";

    // User must be part of the tenant (i.e., have roles)
    if (!roles || roles.length === 0) return "DENY_MEMBERSHIP_NOT_FOUND";

    if (membershipStatus !== "active") return "DENY_MEMBERSHIP_INACTIVE";

    // Handle invalid status combinations (defensive programming)
    if (tenantStatus === "pending" && onboardingStatus === "completed") return "DENY_INVALID_STATUS_COMBINATION";
    if (tenantStatus === "rejected" && onboardingStatus === "in_progress") return "DENY_INVALID_STATUS_COMBINATION";
    
    // Explicit deny cases for inactive tenant
    if (tenantStatus === "suspended" || tenantStatus === "disabled" || tenantStatus === "rejected" || tenantStatus === "pending") {
      return "DENY_TENANT_INACTIVE";
    }

    // Active cases
    if (tenantStatus === "active") {
      if (onboardingStatus === "completed") {
        return "ALLOW";
      } else {
        return "REQUIRE_ONBOARDING";
      }
    }

    return "DENY_UNAUTHORIZED"; // Default deny for any unknown state
  }
}

export const tenantAccessPolicy = new TenantAccessPolicy();

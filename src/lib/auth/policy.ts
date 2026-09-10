import { AuthorizedDashboardContext, DashboardPermission } from "@/types/auth";

export class DashboardAuthorizationPolicy {
  authorize(context: AuthorizedDashboardContext, permission: DashboardPermission): boolean {
    if (context.tenantStatus !== "active") return false;
    if (context.tenantOnboardingStatus !== "completed") return false;

    // A real implementation would map roles to specific permissions.
    // For now, if the user has the permission directly or via role defaults, we allow it.
    if (context.permissions.has(permission)) return true;

    // Basic RBAC
    if (context.roles.includes("owner")) {
      return true; // owners have all permissions
    }

    if (context.roles.includes("admin")) {
      return permission !== "billing:manage"; // admins have all except billing:manage
    }

    if (context.roles.includes("manager")) {
      return ["dashboard:view", "credits:view", "files:view", "tickets:view", "profile:view"].includes(permission);
    }

    if (context.roles.includes("staff")) {
      return ["dashboard:view", "files:view", "tickets:view"].includes(permission);
    }

    if (context.roles.includes("customer")) {
      return ["dashboard:view", "files:view", "tickets:view", "profile:view"].includes(permission);
    }

    return false;
  }
}

export const authorizationPolicy = new DashboardAuthorizationPolicy();

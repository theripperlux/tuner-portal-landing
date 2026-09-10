export type DashboardRole =
  | "owner"
  | "admin"
  | "manager"
  | "staff"
  | "customer";

export type DashboardPermission =
  | "dashboard:view"
  | "credits:view"
  | "files:view"
  | "tickets:view"
  | "profile:view"
  | "settings:view"
  | "billing:view"
  | "billing:manage"
  | "vehicles:view"
  | "vehicles:manage";

export type TenantStatus =
  | "pending"
  | "active"
  | "suspended"
  | "disabled"
  | "rejected";

export type TenantOnboardingStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "blocked";

export type AuthorizedDashboardContext = {
  userId: string;
  tenantId: string;
  membershipId: string;
  customerProfileId: string | null;
  roles: readonly DashboardRole[];
  permissions: ReadonlySet<DashboardPermission>;
  locale: string;
  tenantStatus: TenantStatus;
  tenantOnboardingStatus: TenantOnboardingStatus;
  membershipStatus: "active" | "inactive" | "invited" | "blocked";
};

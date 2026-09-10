export type DashboardUnavailableReason = "unauthenticated" | "unauthorized" | "tenant_inactive" | "profile_missing" | "temporarily_unavailable" | "not_configured";

export type DashboardEmptyState = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export type DashboardPublicErrorCode = "fetch_failed" | "permission_denied" | "service_offline";

export type DashboardWidgetState<T> =
  | {
      status: "ready";
      data: T;
      updatedAt: string;
    }
  | {
      status: "empty";
      emptyState: DashboardEmptyState;
    }
  | {
      status: "unavailable";
      reason: DashboardUnavailableReason;
    }
  | {
      status: "error";
      publicErrorCode: DashboardPublicErrorCode;
    };

export type DashboardTenantSummary = {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
};

export type DashboardProfileSummary = {
  id: string;
  name: string;
  email: string | null;
  initials: string;
};

export type DashboardCreditSummary = {
  available: number;
  // Potentially reserved or pending credits could go here later
};

export type DashboardFileStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type RecentFileSummary = {
  id: string;
  publicReference: string;
  status: DashboardFileStatus;
  vehicleLabel?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardFileSummary = {
  activeCount: number;
  completedCount: number;
  recentFiles: readonly RecentFileSummary[];
};

export type DashboardTicketStatus = "OPEN" | "CLOSED" | "WAITING";

export type RecentTicketSummary = {
  id: string;
  publicReference: string;
  subject: string;
  status: DashboardTicketStatus;
  createdAt: string;
};

export type DashboardTicketSummary = {
  openCount: number;
  recentTickets: readonly RecentTicketSummary[];
};

export type DashboardActivityItem = {
  id: string;
  type: "file_upload" | "ticket_created" | "credit_purchase";
  description: string;
  createdAt: string;
};

export type DashboardOverview = {
  tenant: DashboardWidgetState<DashboardTenantSummary>;
  profile: DashboardWidgetState<DashboardProfileSummary>;
  credits: DashboardWidgetState<DashboardCreditSummary>;
  files: DashboardWidgetState<DashboardFileSummary>;
  tickets: DashboardWidgetState<DashboardTicketSummary>;
  recentActivity: DashboardWidgetState<readonly DashboardActivityItem[]>;
};

export type DashboardOverviewResult =
  | {
      success: true;
      data: DashboardOverview;
    }
  | {
      success: false;
      error: DashboardUnavailableReason;
    };

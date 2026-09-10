import { DashboardFileStatus, DashboardTicketStatus } from "@/types/dashboard";

export interface DashboardCreditSummaryResult {
  available: number;
}

export interface DashboardFileSummaryItem {
  id: string;
  status: DashboardFileStatus;
  createdAt: string;
}

export interface DashboardFileSummaryResult {
  activeCount: number;
  completedCount: number;
  recentFiles: DashboardFileSummaryItem[];
}

export interface DashboardTicketSummaryItem {
  id: string;
  subject: string;
  status: DashboardTicketStatus;
  createdAt: string;
}

export interface DashboardTicketSummaryResult {
  openCount: number;
  recentTickets: DashboardTicketSummaryItem[];
}

export type TenantScope = {
  readonly tenantId: string;
  readonly userId: string;
  readonly membershipId: string;
};

export interface DashboardFilesSummaryOptions {
  readonly recentLimit: number;
}

export interface DashboardTicketsSummaryOptions {
  readonly recentLimit: number;
}

// Formal interfaces that the UI query depends on, abstracting Prisma
export interface DashboardCreditsRepository {
  getSummary(scope: TenantScope): Promise<DashboardCreditSummaryResult>;
}

export interface DashboardFilesRepository {
  getSummary(scope: TenantScope, options: DashboardFilesSummaryOptions): Promise<DashboardFileSummaryResult>;
}

export interface DashboardTicketsRepository {
  getSummary(scope: TenantScope, options: DashboardTicketsSummaryOptions): Promise<DashboardTicketSummaryResult>;
}

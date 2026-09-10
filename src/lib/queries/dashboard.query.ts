import { AuthorizedDashboardContext } from "@/types/auth";
import { DashboardOverviewResult, DashboardOverview } from "@/types/dashboard";
import { prisma } from "@/lib/prisma";
import { authorizationPolicy } from "@/lib/auth/policy";
import { tenantAccessPolicy } from "@/lib/auth/tenantAccess.policy";
import { 
  PrismaDashboardCreditsRepository, 
  PrismaDashboardFilesRepository, 
  PrismaDashboardTicketsRepository 
} from "@/lib/repositories/dashboard.prisma";

export class DashboardOverviewQuery {
  constructor(
    private creditsRepo = new PrismaDashboardCreditsRepository(),
    private filesRepo = new PrismaDashboardFilesRepository(),
    private ticketsRepo = new PrismaDashboardTicketsRepository()
  ) {}

  async execute(context: AuthorizedDashboardContext): Promise<DashboardOverviewResult> {
    // 1. Authorization
    const access = tenantAccessPolicy.evaluate({
      authenticatedUserId: context.userId,
      activeTenantId: context.tenantId,
      requestedTenantId: context.tenantId, // Assuming requesting own
      tenantStatus: context.tenantStatus,
      onboardingStatus: context.tenantOnboardingStatus,
      roles: context.roles,
      permissions: context.permissions,
      membershipStatus: context.membershipStatus
    });

    if (access !== "ALLOW") {
      return { success: false, error: "tenant_inactive" };
    }
    
    if (!authorizationPolicy.authorize(context, "dashboard:view")) {
      return { success: false, error: "unauthorized" };
    }

    if (!context.tenantId) {
      return { success: false, error: "not_configured" };
    }

    // 2. Parallel Data Fetching with strict tenantId isolation
    try {
      const scope = {
        tenantId: context.tenantId,
        userId: context.userId,
        membershipId: context.membershipId
      };

      const [tenant, user, creditsResult, filesResult, ticketsResult] = await Promise.all([
        prisma.tenant.findUnique({
          where: { id: context.tenantId }
        }),
        prisma.user.findUnique({
          where: { id: context.userId }
        }),
        this.creditsRepo.getSummary(scope),
        this.filesRepo.getSummary(scope, { recentLimit: 5 }),
        this.ticketsRepo.getSummary(scope, { recentLimit: 5 })
      ]);

      if (!tenant) return { success: false, error: "tenant_inactive" };
      if (!user) return { success: false, error: "profile_missing" };

      // 3. Mapping to Read Model
      const overview: DashboardOverview = {
        tenant: {
          status: "ready",
          data: {
            id: tenant.id,
            name: tenant.name,
            domain: tenant.domain,
            logoUrl: tenant.logoUrl
          },
          updatedAt: new Date().toISOString()
        },
        profile: {
          status: "ready",
          data: {
            id: user.id,
            name: user.firstName || user.companyName || "Kunde",
            email: user.email,
            initials: (user.firstName || user.companyName || user.email || "U").substring(0, 2).toUpperCase()
          },
          updatedAt: new Date().toISOString()
        },
        credits: {
          status: "ready",
          data: {
            available: creditsResult.available
          },
          updatedAt: new Date().toISOString()
        },
        files: filesResult.activeCount > 0 || filesResult.completedCount > 0 ? {
          status: "ready",
          data: {
            activeCount: filesResult.activeCount,
            completedCount: filesResult.completedCount,
            recentFiles: filesResult.recentFiles.map(f => ({
              ...f,
              publicReference: f.id.slice(-6).toUpperCase(),
              updatedAt: f.createdAt
            }))
          },
          updatedAt: new Date().toISOString()
        } : {
          status: "empty",
          emptyState: { title: "Keine Files", description: "Es wurden noch keine Tuning-Files bearbeitet." }
        },
        tickets: ticketsResult.openCount > 0 || ticketsResult.recentTickets.length > 0 ? {
          status: "ready",
          data: {
            openCount: ticketsResult.openCount,
            recentTickets: ticketsResult.recentTickets.map(t => ({
              ...t,
              publicReference: t.id.slice(-6).toUpperCase()
            }))
          },
          updatedAt: new Date().toISOString()
        } : {
          status: "empty",
          emptyState: { title: "Keine Tickets", description: "Du hast derzeit keine offenen Anfragen." }
        },
        recentActivity: {
          status: "empty",
          emptyState: { title: "Keine Aktivität", description: "Bisher gibt es keine neuen Ereignisse." }
        }
      };

      return { success: true, data: overview };
    } catch (e) {
      console.error(e);
      return { success: false, error: "temporarily_unavailable" };
    }
  }
}

export const dashboardQuery = new DashboardOverviewQuery();

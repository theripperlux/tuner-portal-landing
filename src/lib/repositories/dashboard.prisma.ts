import { PrismaClient } from "@/generated/prisma/client";
import { prisma as globalPrisma } from "@/lib/prisma";
import { 
  DashboardCreditsRepository, 
  DashboardFilesRepository, 
  DashboardTicketsRepository,
  DashboardCreditSummaryResult,
  DashboardFileSummaryResult,
  DashboardTicketSummaryResult,
  DashboardFilesSummaryOptions,
  DashboardTicketsSummaryOptions,
  TenantScope
} from "./dashboard.repository.types";
import { DashboardFileStatus, DashboardTicketStatus } from "@/types/dashboard";

export class PrismaDashboardCreditsRepository implements DashboardCreditsRepository {
  constructor(private prisma: PrismaClient = globalPrisma) {}
  async getSummary(scope: TenantScope): Promise<DashboardCreditSummaryResult> {
    const membership = await this.prisma.tenantMembership.findUnique({
      where: { 
        id: scope.membershipId,
        userId_tenantId: { userId: scope.userId, tenantId: scope.tenantId }
      },
      select: { credits: true }
    });
    return { available: membership?.credits || 0 };
  }
}

export class PrismaDashboardFilesRepository implements DashboardFilesRepository {
  constructor(private prisma: PrismaClient = globalPrisma) {}
  async getSummary(scope: TenantScope, options: DashboardFilesSummaryOptions): Promise<DashboardFileSummaryResult> {
    const [activeCount, completedCount, recentFiles] = await Promise.all([
      this.prisma.tuningJob.count({
        where: { tenantId: scope.tenantId, userId: scope.userId, status: { in: ['PENDING', 'PROCESSING'] } }
      }),
      this.prisma.tuningJob.count({
        where: { tenantId: scope.tenantId, userId: scope.userId, status: 'COMPLETED' }
      }),
      this.prisma.tuningJob.findMany({
        where: { tenantId: scope.tenantId, userId: scope.userId },
        orderBy: { createdAt: 'desc' },
        take: options.recentLimit
      })
    ]);
    
    return {
      activeCount,
      completedCount,
      recentFiles: recentFiles.map(f => ({
        id: f.id,
        status: f.status as DashboardFileStatus,
        createdAt: f.createdAt.toISOString()
      }))
    };
  }
}

export class PrismaDashboardTicketsRepository implements DashboardTicketsRepository {
  constructor(private prisma: PrismaClient = globalPrisma) {}
  async getSummary(scope: TenantScope, options: DashboardTicketsSummaryOptions): Promise<DashboardTicketSummaryResult> {
    const [openCount, recentTickets] = await Promise.all([
      this.prisma.ticket.count({
        where: { tenantId: scope.tenantId, userId: scope.userId, status: 'OPEN' }
      }),
      this.prisma.ticket.findMany({
        where: { tenantId: scope.tenantId, userId: scope.userId },
        orderBy: { createdAt: 'desc' },
        take: options.recentLimit
      })
    ]);

    return {
      openCount,
      recentTickets: recentTickets.map(t => ({
        id: t.id,
        subject: t.subject,
        status: t.status as DashboardTicketStatus,
        createdAt: t.createdAt.toISOString()
      }))
    };
  }
}

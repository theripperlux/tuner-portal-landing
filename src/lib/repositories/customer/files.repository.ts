import { PrismaClient } from "@/generated/prisma/client";
import { prisma as globalPrisma } from "@/lib/prisma";
import { TenantScope } from "../dashboard.repository.types";
import { 
  CustomerFilesRepository, 
  CustomerFilesPageQuery, 
  CustomerFilesPage, 
  TuningJobDetails 
} from "./files.repository.types";

export class PrismaCustomerFilesRepository implements CustomerFilesRepository {
  constructor(private prisma: PrismaClient = globalPrisma) {}

  async findPage(
    scope: TenantScope,
    query: CustomerFilesPageQuery
  ): Promise<CustomerFilesPage> {
    const limit = Math.min(query.limit, 100);
    
    const items = await this.prisma.tuningJob.findMany({
      where: {
        tenantId: scope.tenantId,
        userId: scope.userId
      },
      take: limit + 1,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        originalFile: true
      }
    });

    let nextCursor: string | null = null;
    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items: items.map(job => ({
        id: job.id,
        status: job.status,
        originalFilename: job.originalFile.originalFilename,
        calculatedCreditCost: job.calculatedCreditCost,
        createdAt: job.createdAt
      })),
      nextCursor
    };
  }

  async findById(
    scope: TenantScope,
    jobId: string
  ): Promise<TuningJobDetails | null> {
    const job = await this.prisma.tuningJob.findUnique({
      where: { id: jobId },
      include: { originalFile: true }
    });

    if (!job || job.tenantId !== scope.tenantId || job.userId !== scope.userId) {
      return null;
    }

    return {
      id: job.id,
      status: job.status,
      originalFilename: job.originalFile.originalFilename,
      originalFileId: job.originalFileId,
      tunedFileId: job.tunedFileId,
      calculatedCreditCost: job.calculatedCreditCost,
      createdAt: job.createdAt
    };
  }
}

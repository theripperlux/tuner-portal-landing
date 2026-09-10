import { TenantScope } from "@/lib/repositories/dashboard.repository.types";
import { PricingService, CalculateJobPriceCommand } from "./PricingService";
import { prisma } from "@/lib/prisma";

export interface SubmitTuningJobCommand {
  uploadId: string;
  vehicleId: string;
  selectedServiceIds: string[];
  customerNote?: string;
  idempotencyKey: string;
}

export interface SubmitTuningJobResult {
  jobId: string;
  status: string;
  chargedCredits: number;
}

export class SubmitTuningJobService {
  constructor(private pricingService: PricingService = new PricingService()) {}

  async execute(
    scope: TenantScope,
    command: SubmitTuningJobCommand
  ): Promise<SubmitTuningJobResult> {
    
    // 1. Check Idempotency Key existence early (Fast fail)
    const existingJob = await prisma.tuningJob.findUnique({
      where: { submissionIdempotencyKey: command.idempotencyKey }
    });
    
    if (existingJob) {
      if (existingJob.tenantId !== scope.tenantId || existingJob.userId !== scope.userId) {
         throw new Error("IDEMPOTENCY_CONFLICT");
      }
      // Return previous result if payload matches conceptually (simplified for MVP)
      return {
        jobId: existingJob.id,
        status: existingJob.status,
        chargedCredits: existingJob.calculatedCreditCost
      };
    }

    // 2. Load File and validate status
    const file = await prisma.storedFile.findUnique({
      where: { id: command.uploadId }
    });

    if (!file || file.tenantId !== scope.tenantId || file.status !== "QUARANTINED") {
      throw new Error("UPLOAD_NOT_READY");
    }

    // 3. Calculate Price Server-Side
    const priceResult = await this.pricingService.calculatePrice(scope, {
      vehicleId: command.vehicleId,
      selectedServiceIds: command.selectedServiceIds
    });

    const cost = priceResult.totalCredits;

    // 4. Atomic Transaction: Check Credits, Deduct Credits, Create Job, Update File Status
    return await prisma.$transaction(async (tx) => {
      // Re-check membership for latest credits with lock/isolation
      const membership = await tx.tenantMembership.findUnique({
        where: { id: scope.membershipId }
      });

      if (!membership || membership.credits < cost) {
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // Deduct Credits
      await tx.tenantMembership.update({
        where: { id: scope.membershipId },
        data: { credits: { decrement: cost } }
      });

      // Create CreditTransaction
      const transaction = await tx.creditTransaction.create({
        data: {
          tenantId: scope.tenantId,
          membershipId: scope.membershipId,
          amount: -cost,
          type: "USAGE",
          reason: `Job submission for ${file.originalFilename}`,
          idempotencyKey: `job_${command.idempotencyKey}`
        }
      });

      // Update File Status to READY
      await tx.storedFile.update({
        where: { id: command.uploadId },
        data: { status: "READY" }
      });

      // Create Job
      const job = await tx.tuningJob.create({
        data: {
          userId: scope.userId,
          tenantId: scope.tenantId,
          membershipId: scope.membershipId,
          originalFileId: command.uploadId,
          status: "SUBMITTED",
          calculatedCreditCost: cost,
          pricingVersion: priceResult.pricingVersion,
          submissionIdempotencyKey: command.idempotencyKey
        }
      });

      return {
        jobId: job.id,
        status: job.status,
        chargedCredits: cost
      };
    });
  }
}

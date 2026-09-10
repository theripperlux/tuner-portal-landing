import { prisma } from "./prisma";
import { TenantScope } from "./repositories/dashboard.repository.types";

export type ConsumeCreditsCommand = {
  readonly scope: TenantScope;
  readonly amount: number;
  readonly reason: string;
  readonly idempotencyKey: string;
};

export type AddCreditsCommand = {
  readonly scope: TenantScope;
  readonly amount: number;
  readonly reason: string;
  readonly idempotencyKey: string;
};

export async function addCredits(command: AddCreditsCommand) {
  return await prisma.$transaction(async (tx) => {
    // 1. Check membership existence and validity
    const membership = await tx.tenantMembership.findUnique({
      where: { 
        id: command.scope.membershipId,
        userId_tenantId: { userId: command.scope.userId, tenantId: command.scope.tenantId },
      }
    });

    if (!membership || membership.membershipStatus !== 'active') {
      throw new Error("Invalid or inactive membership");
    }

    // 2. Perform increment (Safe from negative, as we only add)
    const updatedMembership = await tx.tenantMembership.update({
      where: { id: command.scope.membershipId },
      data: { credits: { increment: command.amount } },
    });

    // 3. Log transaction
    await tx.creditTransaction.create({
      data: {
        membershipId: command.scope.membershipId,
        tenantId: command.scope.tenantId,
        amount: command.amount,
        type: "PURCHASE",
        reason: command.reason,
        idempotencyKey: command.idempotencyKey
      },
    });

    return updatedMembership;
  });
}

export async function consumeCredits(command: ConsumeCreditsCommand) {
  return await prisma.$transaction(async (tx) => {
    // 1. Check membership existence and validity
    const membership = await tx.tenantMembership.findUnique({
      where: { 
        id: command.scope.membershipId,
        userId_tenantId: { userId: command.scope.userId, tenantId: command.scope.tenantId },
      }
    });

    if (!membership || membership.membershipStatus !== 'active') {
      throw new Error("Invalid or inactive membership");
    }

    // 2. Perform atomic decrement WITH condition
    // Prisma's updateMany allows us to conditionally decrement only if credits >= amount
    const updateResult = await tx.tenantMembership.updateMany({
      where: { 
        id: command.scope.membershipId,
        tenantId: command.scope.tenantId,
        userId: command.scope.userId,
        membershipStatus: 'active',
        credits: { gte: command.amount } 
      },
      data: { credits: { decrement: command.amount } },
    });

    // 3. Verify exactly 1 row was updated
    if (updateResult.count !== 1) {
      throw new Error("Insufficient credits or concurrent modification");
    }

    // 4. Log transaction
    await tx.creditTransaction.create({
      data: {
        membershipId: command.scope.membershipId,
        tenantId: command.scope.tenantId,
        amount: -command.amount,
        type: "USAGE",
        reason: command.reason,
        idempotencyKey: command.idempotencyKey
      },
    });

    // Fetch the final membership to return
    return await tx.tenantMembership.findUnique({ where: { id: command.scope.membershipId } });
  });
}

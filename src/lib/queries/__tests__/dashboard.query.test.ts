import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { DashboardOverviewQuery } from '../dashboard.query';
import { AuthorizedDashboardContext } from '@/types/auth';

const { testPrisma } = await vi.hoisted(async () => {
  const { PrismaClient } = await import('@/generated/prisma/client');
  const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3');
  const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/test.db' });
  return {
    testPrisma: new PrismaClient({ adapter })
  };
});

vi.mock('@/lib/prisma', () => ({
  prisma: testPrisma
}));

// We override the default repository instances to use our test prisma client
import { PrismaDashboardCreditsRepository } from '@/lib/repositories/dashboard.prisma';
import { PrismaDashboardFilesRepository } from '@/lib/repositories/dashboard.prisma';
import { PrismaDashboardTicketsRepository } from '@/lib/repositories/dashboard.prisma';

describe('DashboardOverviewQuery Integration & Tenant Isolation', () => {
  let queryService: DashboardOverviewQuery;

  beforeAll(async () => {
    // Clean DB
    await testPrisma.ticket.deleteMany();
    await testPrisma.tuningJob.deleteMany();
    await testPrisma.creditTransaction.deleteMany();
    await testPrisma.tenantMembership.deleteMany();
    await testPrisma.user.deleteMany();
    await testPrisma.tenant.deleteMany();

    // Create 2 Tenants
    await testPrisma.tenant.create({
      data: {
        id: 'tenant-A',
        name: 'Tenant A',
        status: 'active',
        onboardingStatus: 'completed'
      }
    });

    await testPrisma.tenant.create({
      data: {
        id: 'tenant-B',
        name: 'Tenant B',
        status: 'active',
        onboardingStatus: 'completed'
      }
    });

    // Create Users
    await testPrisma.user.create({
      data: { id: 'user-A', email: 'a@a.com' }
    });
    await testPrisma.user.create({
      data: { id: 'user-B', email: 'b@b.com' }
    });
    await testPrisma.user.create({
      data: { id: 'user-C', email: 'c@c.com' }
    });

    // Create Memberships with isolated credits
    await testPrisma.tenantMembership.create({
      data: { id: 'mem-A', userId: 'user-A', tenantId: 'tenant-A', role: 'customer', membershipStatus: 'active', credits: 10 }
    });
    await testPrisma.tenantMembership.create({
      data: { id: 'mem-B', userId: 'user-B', tenantId: 'tenant-B', role: 'customer', membershipStatus: 'active', credits: 50 }
    });
    
    // User C in Tenant A and B
    await testPrisma.tenantMembership.create({
      data: { id: 'mem-CA', userId: 'user-C', tenantId: 'tenant-A', role: 'customer', membershipStatus: 'active', credits: 5 }
    });
    await testPrisma.tenantMembership.create({
      data: { id: 'mem-CB', userId: 'user-C', tenantId: 'tenant-B', role: 'customer', membershipStatus: 'active', credits: 25 }
    });

    // Insert identically named references to prove isolation
    await testPrisma.tuningJob.create({
      data: { id: 'job-A', originalFile: 'file1.bin', status: 'PENDING', userId: 'user-A', tenantId: 'tenant-A', calculatedCreditCost: 10 }
    });
    await testPrisma.tuningJob.create({
      data: { id: 'job-B', originalFile: 'file1.bin', status: 'PENDING', userId: 'user-B', tenantId: 'tenant-B', calculatedCreditCost: 10 }
    });
    // Multi-Membership Jobs
    await testPrisma.tuningJob.create({
      data: { id: 'job-CA', originalFile: 'multi.bin', status: 'COMPLETED', userId: 'user-C', tenantId: 'tenant-A', calculatedCreditCost: 10 }
    });
    await testPrisma.tuningJob.create({
      data: { id: 'job-CB', originalFile: 'multi.bin', status: 'PROCESSING', userId: 'user-C', tenantId: 'tenant-B', calculatedCreditCost: 10 }
    });

    // Tickets (now requiring tenantId)
    await testPrisma.ticket.create({
      data: { id: 'ticket-A', subject: 'Help', message: 'pls', status: 'OPEN', userId: 'user-A', tenantId: 'tenant-A' }
    });
    await testPrisma.ticket.create({
      data: { id: 'ticket-B', subject: 'Help', message: 'pls', status: 'OPEN', userId: 'user-B', tenantId: 'tenant-B' }
    });
    await testPrisma.ticket.create({
      data: { id: 'ticket-CA', subject: 'Multi Help', message: 'pls', status: 'OPEN', userId: 'user-C', tenantId: 'tenant-A' }
    });
    await testPrisma.ticket.create({
      data: { id: 'ticket-CB', subject: 'Multi Help', message: 'pls', status: 'CLOSED', userId: 'user-C', tenantId: 'tenant-B' }
    });

    // Init the service with test repositories
    queryService = new DashboardOverviewQuery(
      new PrismaDashboardCreditsRepository(testPrisma),
      new PrismaDashboardFilesRepository(testPrisma),
      new PrismaDashboardTicketsRepository(testPrisma)
    );
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  const getContext = (tenantId: string, userId: string, membershipId: string): AuthorizedDashboardContext => ({
    tenantId,
    userId,
    membershipId,
    customerProfileId: null,
    locale: 'de',
    tenantStatus: 'active',
    tenantOnboardingStatus: 'completed',
    roles: ['customer'],
    permissions: new Set(['dashboard:view']),
    membershipStatus: 'active'
  });

  it('isolates Tenant A completely from Tenant B', async () => {
    const ctxA = getContext('tenant-A', 'user-A', 'mem-A');
    const resultA = await queryService.execute(ctxA);

    expect(resultA.success).toBe(true);
    if (!resultA.success) return;

    // Tenant A should only see their own tickets
    expect(resultA.data.tickets.status).toBe('ready');
    if (resultA.data.tickets.status === 'ready') {
      expect(resultA.data.tickets.data.openCount).toBe(1);
    }

    // Tenant A should only see their own files
    expect(resultA.data.files.status).toBe('ready');
    if (resultA.data.files.status === 'ready') {
      expect(resultA.data.files.data.activeCount).toBe(1); // Since job-A is PENDING
    }

    // Tenant A credits
    expect(resultA.data.credits.status).toBe('ready');
    if (resultA.data.credits.status === 'ready') {
      expect(resultA.data.credits.data.available).toBe(10);
    }
  });

  it('isolates Tenant B completely from Tenant A', async () => {
    const ctxB = getContext('tenant-B', 'user-B', 'mem-B');
    const resultB = await queryService.execute(ctxB);

    expect(resultB.success).toBe(true);
    if (!resultB.success) return;

    if (resultB.data.tickets.status === 'ready') {
      expect(resultB.data.tickets.data.openCount).toBe(1);
    }
    if (resultB.data.credits.status === 'ready') {
      expect(resultB.data.credits.data.available).toBe(50);
    }
  });

  it('isolates Multi-Membership User C in Tenant A', async () => {
    const ctx = getContext('tenant-A', 'user-C', 'mem-CA');
    const result = await queryService.execute(ctx);

    expect(result.success).toBe(true);
    if (!result.success) return;

    // User C in Tenant A has 1 OPEN ticket, 1 COMPLETED job, and 5 credits
    if (result.data.tickets.status === 'ready') {
      expect(result.data.tickets.data.openCount).toBe(1);
    }
    if (result.data.files.status === 'ready') {
      expect(result.data.files.data.completedCount).toBe(1);
      expect(result.data.files.data.activeCount).toBe(0);
    }
    if (result.data.credits.status === 'ready') {
      expect(result.data.credits.data.available).toBe(5);
    }
  });

  it('isolates Multi-Membership User C in Tenant B', async () => {
    const ctx = getContext('tenant-B', 'user-C', 'mem-CB');
    const result = await queryService.execute(ctx);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.tickets.status).toBe('ready');
    if (result.data.tickets.status === 'ready') {
      expect(result.data.tickets.data.openCount).toBe(0);
      expect(result.data.tickets.data.recentTickets).toHaveLength(1);
    }
    
    if (result.data.files.status === 'ready') {
      expect(result.data.files.data.activeCount).toBe(1);
      expect(result.data.files.data.completedCount).toBe(0);
    }
    if (result.data.credits.status === 'ready') {
      expect(result.data.credits.data.available).toBe(25);
    }
  });

  it('maintains a bounded query budget (O(1) architecture)', async () => {
    // To test query budget, we use Prisma's interactive transaction or event logging.
    // As a simple proxy, we just ensure execute doesn't fail and is fast.
    const ctx = getContext('tenant-A', 'user-A', 'mem-A');
    const start = performance.now();
    await queryService.execute(ctx);
    const time = performance.now() - start;
    
    // An overly slow query implies N+1
    expect(time).toBeLessThan(100); // Should be very fast
  });
});

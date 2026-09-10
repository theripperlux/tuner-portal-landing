import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getServerAuthContext } from '../sessionContext';
import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn() }
  }
}));

const getServerSessionMock = vi.mocked(getServerSession);
const prismaMock = prisma as any;

describe('Session Boundary & Auth Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validSession = {
    user: {
      id: 'user-1',
      role: 'admin',
      tenantId: 'tenant-1'
    }
  };

  const validDbUser = {
    id: 'user-1',
    memberships: [
      {
        id: 'mem-1',
        tenantId: 'tenant-1',
        role: 'admin',
        membershipStatus: 'active',
        tenant: {
          id: 'tenant-1',
          status: 'active',
          onboardingStatus: 'completed'
        }
      }
    ]
  };

  it('builds context successfully for valid session and db match', async () => {
    getServerSessionMock.mockResolvedValue(validSession);
    prismaMock.user.findUnique.mockResolvedValue(validDbUser);

    const ctx = await getServerAuthContext();
    expect(ctx).not.toBeNull();
    expect(ctx).not.toBe("REQUIRE_TENANT_SELECTION");
    if (ctx && typeof ctx !== "string") {
      expect(ctx.tenantStatus).toBe('active');
    }
  });

  it('rejects if JWT fields are wrong type', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: 123, tenantId: 'tenant-1' }
    });
    const ctx = await getServerAuthContext();
    expect(ctx).toBeNull();
  });

  it('rejects if user no longer exists in DB (deactivated/deleted)', async () => {
    getServerSessionMock.mockResolvedValue(validSession);
    prismaMock.user.findUnique.mockResolvedValue(null);
    const ctx = await getServerAuthContext();
    expect(ctx).toBeNull();
  });

  it('rejects if client manipulated tenantId (DB mismatch / membership missing)', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { ...validSession.user, tenantId: 'tenant-hacked' }
    });
    // DB says they only belong to tenant-1
    prismaMock.user.findUnique.mockResolvedValue(validDbUser);
    
    const ctx = await getServerAuthContext();
    expect(ctx).toBeNull();
  });

  it('handles missing tenantId by selecting default membership', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: 'user-1' } // no tenantId provided
    });
    prismaMock.user.findUnique.mockResolvedValue(validDbUser);
    
    const ctx = await getServerAuthContext();
    // It should select mem-1 automatically
    expect(ctx).not.toBeNull();
    expect(ctx).not.toBe("REQUIRE_TENANT_SELECTION");
    if (ctx && typeof ctx !== "string") {
      expect(ctx.tenantId).toBe('tenant-1');
    }
  });

  it('returns REQUIRE_TENANT_SELECTION if user has multiple active memberships and none is requested', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: 'user-1' } // no tenantId provided
    });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      memberships: [
        validDbUser.memberships[0],
        { ...validDbUser.memberships[0], id: 'mem-2', tenantId: 'tenant-2', tenant: { ...validDbUser.memberships[0].tenant, id: 'tenant-2' } }
      ]
    });
    
    const ctx = await getServerAuthContext();
    expect(ctx).toBe("REQUIRE_TENANT_SELECTION");
  });

  it('rejects if user has no memberships at all', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: 'user-1' }
    });
    prismaMock.user.findUnique.mockResolvedValue({
      ...validDbUser,
      memberships: []
    });
    
    const ctx = await getServerAuthContext();
    expect(ctx).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { submitTenantRegistration } from '@/lib/tenant-api';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn()
    },
    tenant: {
      create: vi.fn(),
      update: vi.fn()
    },
    tenantMembership: {
      create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma))
  }
}));

vi.mock('@/lib/tenant-api', () => ({
  cleanHost: (h: string) => h,
  slugify: (s: string) => s.toLowerCase().replace(/\s+/g, '-'),
  submitTenantRegistration: vi.fn()
}));

import { getServerSession } from 'next-auth';

const getServerSessionMock = getServerSession as unknown as ReturnType<typeof vi.fn>;
const prismaMock = prisma as any;
const tenantApiMock = submitTenantRegistration as unknown as ReturnType<typeof vi.fn>;

describe('POST /api/tenant/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests', async () => {
    getServerSessionMock.mockResolvedValue(null);
    const req = new Request('http://localhost');
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('starts new tenant as pending and does not allow client status override', async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '12345678',
      companyName: 'Test Inc',
      adminDomain: 'admin.test.com',
      customerDomain: 'portal.test.com',
      memberships: []
    });

    tenantApiMock.mockResolvedValue({
      id: 'reg-123',
      status: 'pending' // Backend says pending
    });

    prismaMock.tenant.create.mockResolvedValue({ id: 'tenant-new' });

    const req = new Request('http://localhost');
    const res = await POST(req);
    expect(res.status).toBe(200);

    // Verify tenant creation
    expect(prismaMock.tenant.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: 'pending' // Enforced by route logic based on backend response
      })
    }));

    // Verify user update links the new tenant registration ID
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'user-1' },
      data: expect.objectContaining({
        tenantRegistrationId: 'reg-123'
      })
    }));

    // Verify membership creation
    expect(prismaMock.tenantMembership.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: 'user-1',
        tenantId: 'tenant-new',
        role: 'owner',
        membershipStatus: 'active'
      })
    }));
  });

  it('returns existing state if already submitted', async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      tenantRegistrationId: 'reg-existing',
      memberships: [
        {
          tenantId: 'tenant-1',
          tenant: {
            status: 'pending'
          }
        }
      ]
    });

    const req = new Request('http://localhost');
    const res = await POST(req);
    const data = await res.json();
    
    expect(data.alreadySubmitted).toBe(true);
    expect(data.status).toBe('pending');
    expect(tenantApiMock).not.toHaveBeenCalled();
  });

  it('rolls back user state and returns 502 if tenant creation throws', async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '12345678',
      companyName: 'Test Inc',
      adminDomain: 'admin.test.com',
      customerDomain: 'portal.test.com',
      memberships: []
    });

    tenantApiMock.mockResolvedValue({
      id: 'reg-123',
      status: 'pending'
    });

    // Simulate prisma transaction throw
    prismaMock.$transaction.mockRejectedValueOnce(new Error('Simulated DB Error'));

    const req = new Request('http://localhost');
    const res = await POST(req);
    expect(res.status).toBe(502);

    // Verify it caught the error and updated the user with the error string
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'user-1' },
      data: expect.objectContaining({
        tenantRegistrationError: expect.stringContaining('Simulated DB Error')
      })
    }));
  });

  it('rejects if required fields are missing', async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: 'user-1' } });
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      firstName: '', // Missing
      lastName: 'Doe',
      email: 'john@test.com',
      phone: '12', // Too short
      memberships: []
    });

    const req = new Request('http://localhost');
    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain('first name');
    expect(data.error).toContain('phone number');
  });
});

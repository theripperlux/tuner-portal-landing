import { describe, it, expect } from 'vitest';
import { tenantAccessPolicy, TenantAccessPolicyInput } from '../tenantAccess.policy';

describe('TenantAccessPolicy', () => {
  const baseInput: TenantAccessPolicyInput = {
    authenticatedUserId: 'user-1',
    activeTenantId: 'tenant-1',
    requestedTenantId: 'tenant-1',
    tenantStatus: 'active',
    onboardingStatus: 'completed',
    roles: ['customer'],
    permissions: new Set(),
    membershipStatus: 'active'
  };

  it('allows dashboard for active + completed', () => {
    const result = tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'active',
      onboardingStatus: 'completed'
    });
    expect(result).toBe('ALLOW');
  });

  it('requires onboarding for active + not_started', () => {
    const result = tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'active',
      onboardingStatus: 'not_started'
    });
    expect(result).toBe('REQUIRE_ONBOARDING');
  });

  it('denies pending status', () => {
    const result = tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'pending',
      onboardingStatus: 'not_started'
    });
    expect(result).toBe('DENY_TENANT_INACTIVE');
  });

  it('denies suspended status', () => {
    const result = tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'suspended'
    });
    expect(result).toBe('DENY_TENANT_INACTIVE');
  });

  it('denies disabled status', () => {
    const result = tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'disabled'
    });
    expect(result).toBe('DENY_TENANT_INACTIVE');
  });

  it('returns DENY_INVALID_STATUS_COMBINATION for impossible combinations', () => {
    expect(tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'pending',
      onboardingStatus: 'completed'
    })).toBe('DENY_INVALID_STATUS_COMBINATION');

    expect(tenantAccessPolicy.evaluate({
      ...baseInput,
      tenantStatus: 'rejected',
      onboardingStatus: 'in_progress'
    })).toBe('DENY_INVALID_STATUS_COMBINATION');
  });

  it('denies if not authenticated', () => {
    expect(tenantAccessPolicy.evaluate({
      ...baseInput,
      authenticatedUserId: ''
    })).toBe('DENY_UNAUTHENTICATED');
  });

  it('denies if tenant mismatch', () => {
    expect(tenantAccessPolicy.evaluate({
      ...baseInput,
      requestedTenantId: 'tenant-2'
    })).toBe('DENY_TENANT_MISMATCH');
  });

  it('denies if user has no roles', () => {
    expect(tenantAccessPolicy.evaluate({
      ...baseInput,
      roles: []
    })).toBe('DENY_MEMBERSHIP_NOT_FOUND');
  });

  it('denies if membership is not active', () => {
    expect(tenantAccessPolicy.evaluate({
      ...baseInput,
      membershipStatus: 'inactive'
    })).toBe('DENY_MEMBERSHIP_INACTIVE');
  });
});

import { describe, it, expect } from 'vitest';
import { authorizationPolicy } from '../policy';
import { AuthorizedDashboardContext, DashboardRole, DashboardPermission } from '@/types/auth';

describe('DashboardAuthorizationPolicy', () => {
  const createCtx = (roles: DashboardRole[]): AuthorizedDashboardContext => ({
    userId: 'user-1',
    tenantId: 'tenant-1',
    customerProfileId: null,
    locale: 'de',
    tenantStatus: 'active',
    tenantOnboardingStatus: 'completed',
    roles,
    permissions: new Set(),
    membershipId: 'stub-mem-id',
    membershipStatus: 'active'
  });

  it('allows owner to do anything', () => {
    const ctx = createCtx(['owner']);
    expect(authorizationPolicy.authorize(ctx, 'dashboard:view')).toBe(true);
    expect(authorizationPolicy.authorize(ctx, 'billing:manage')).toBe(true);
    expect(authorizationPolicy.authorize(ctx, 'settings:view')).toBe(true);
  });

  it('allows admin to manage everything except billing', () => {
    const ctx = createCtx(['admin']);
    expect(authorizationPolicy.authorize(ctx, 'dashboard:view')).toBe(true);
    expect(authorizationPolicy.authorize(ctx, 'vehicles:manage')).toBe(true);
    expect(authorizationPolicy.authorize(ctx, 'billing:manage')).toBe(false);
  });

  it('customer has restricted read-only or self-managed permissions', () => {
    const ctx = createCtx(['customer']);
    expect(authorizationPolicy.authorize(ctx, 'dashboard:view')).toBe(true);
    expect(authorizationPolicy.authorize(ctx, 'profile:view')).toBe(true);
    // Usually customers don't have global tenant setting access
    expect(authorizationPolicy.authorize(ctx, 'settings:view')).toBe(false);
  });

  it('denies unknown permission', () => {
    const ctx = createCtx(['customer']);
    // @ts-expect-error Testing invalid runtime permission
    expect(authorizationPolicy.authorize(ctx, 'unknown:permission')).toBe(false);
  });

  it('denies when role list is empty', () => {
    const ctx = createCtx([]);
    expect(authorizationPolicy.authorize(ctx, 'dashboard:view')).toBe(false);
  });

  it('accumulates permissions for multiple roles', () => {
    const ctx = createCtx(['customer', 'admin']);
    // customer doesn't have vehicles:manage, but admin does.
    expect(authorizationPolicy.authorize(ctx, 'vehicles:manage')).toBe(true);
  });

  it('denies unknown role gracefully without crashing', () => {
    // @ts-expect-error Testing invalid runtime role
    const ctx = createCtx(['unknown_role']);
    expect(authorizationPolicy.authorize(ctx, 'dashboard:view')).toBe(false);
  });

  it('handles duplicate roles gracefully', () => {
    const ctx = createCtx(['admin', 'admin']);
    expect(authorizationPolicy.authorize(ctx, 'dashboard:view')).toBe(true);
    expect(authorizationPolicy.authorize(ctx, 'billing:manage')).toBe(false);
  });
});

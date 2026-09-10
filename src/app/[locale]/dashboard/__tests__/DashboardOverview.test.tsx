import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardOverview from '../DashboardOverview';

// Mocking useTranslations since next-intl hooks don't work easily outside app router.
// The mock doesn't know real message templates, so for a plain t(key) it just
// returns the key; when called with interpolation values (e.g. t('overviewWelcome',
// { name }) it appends them as JSON so assertions can still find the interpolated
// value (e.g. the company name) somewhere in the rendered text.
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    values ? `${key} ${JSON.stringify(values)}` : key
}));

describe('DashboardOverview Component', () => {
  const baseData = {
    tenant: { status: 'ready' as const, data: { id: 't1', name: 'Test Tuning Co', domain: 'test.com', logoUrl: null }, updatedAt: '' },
    profile: { status: 'ready' as const, data: { id: 'u1', name: 'John', email: 'j@j.com', initials: 'JO' }, updatedAt: '' },
    credits: { status: 'ready' as const, data: { available: 50 }, updatedAt: '' },
    files: { status: 'ready' as const, data: { activeCount: 2, completedCount: 5, recentFiles: [] }, updatedAt: '' },
    tickets: { status: 'ready' as const, data: { openCount: 1, recentTickets: [] }, updatedAt: '' },
    recentActivity: { status: 'empty' as const, emptyState: { title: 'No Activity', description: 'desc' } }
  };

  it('greets the tenant by company name', () => {
    render(<DashboardOverview data={baseData} adminDomain="admin.test.com" customerDomain="portal.test.com" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/Test Tuning Co/);
  });

  it('renders both portal domain links pointing to https://<domain>', () => {
    render(<DashboardOverview data={baseData} adminDomain="admin.test.com" customerDomain="portal.test.com" />);
    const adminLink = screen.getByText('admin.test.com').closest('a');
    const customerLink = screen.getByText('portal.test.com').closest('a');
    expect(adminLink).toHaveAttribute('href', 'https://admin.test.com');
    expect(customerLink).toHaveAttribute('href', 'https://portal.test.com');
  });

  it('omits a domain link entirely when that domain is not set', () => {
    render(<DashboardOverview data={baseData} adminDomain={null} customerDomain="portal.test.com" />);
    expect(screen.queryByText('admin.test.com')).not.toBeInTheDocument();
    expect(screen.getByText('portal.test.com')).toBeInTheDocument();
  });

  it('falls back to a generic greeting when the tenant has no name', () => {
    const dataNoName = {
      ...baseData,
      tenant: { status: 'unavailable' as const, reason: 'temporarily_unavailable' as const }
    };
    render(<DashboardOverview data={dataNoName} adminDomain={null} customerDomain={null} />);
    expect(screen.getByText('overviewWelcomeGeneric')).toBeInTheDocument();
  });
});

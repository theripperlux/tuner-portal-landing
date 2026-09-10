import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { redirect } from "@/i18n/routing";
import { dashboardQuery } from "@/lib/queries/dashboard.query";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import DashboardOverview from "./DashboardOverview";
import { AuthorizedDashboardContext } from "@/types/auth";

export const dynamic = 'force-dynamic';

/**
 * Builds the props DashboardClient (the onboarding wizard) needs.
 *
 * Two things this deliberately gets right that the old inline version didn't:
 * - tenantStatus/tenantOnboardingStatus come from `context` (freshly queried
 *   from the DB by getServerAuthContext on every request), never from
 *   session.user.* — those are NextAuth JWT claims frozen at login time and
 *   never updated until the user logs out and back in, which made the
 *   "already registered" check permanently false right after a real submit.
 * - companyName/phone/adminDomain/customerDomain are read fresh from the
 *   User row so the form pre-fills with whatever was last saved, instead of
 *   always starting blank.
 */
async function buildOnboardingUser(
  sessionUserId: string,
  sessionEmail: string | null | undefined,
  context: AuthorizedDashboardContext | null
) {
  const profile = await prisma.user.findUnique({
    where: { id: sessionUserId },
    select: { companyName: true, phone: true, adminDomain: true, customerDomain: true },
  });

  return {
    email: sessionEmail,
    companyName: profile?.companyName || '',
    phone: profile?.phone || '',
    adminDomain: profile?.adminDomain || '',
    customerDomain: profile?.customerDomain || '',
    tenantStatus: context?.tenantStatus || 'not_started',
    tenantOnboardingStatus: context?.tenantOnboardingStatus || 'not_started',
  };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect({ href: '/login', locale });
    return null;
  }

  const context = await getServerAuthContext();
  if (context === "REQUIRE_TENANT_SELECTION") {
    redirect({ href: '/select-tenant' as any, locale });
    return null;
  }
  if (!context) {
    // No active tenant membership yet — genuine first-time onboarding.
    const userMock = await buildOnboardingUser(session.user.id, session.user.email, null);
    return <DashboardClient user={userMock as any} />;
  }

  const result = await dashboardQuery.execute(context);

  if (!result.success) {
    // Tenant exists but isn't active yet (e.g. pending approval). Pass the
    // FRESH context status, not the stale session claim — see
    // buildOnboardingUser's doc comment above.
    if (result.error === "tenant_inactive" || result.error === "not_configured") {
      const userMock = await buildOnboardingUser(session.user.id, session.user.email, context);
      return <DashboardClient user={userMock as any} />;
    }

    // For other errors, we could redirect or show an error state
    redirect({ href: '/login', locale });
    return null;
  }

  // If success, the tenant is active — show the portal status page. The
  // configured admin/customer domains live on User, not on the tenant
  // read-model dashboardQuery returns, so fetch them alongside it.
  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { adminDomain: true, customerDomain: true },
  });

  return (
    <DashboardOverview
      data={result.data}
      adminDomain={profile?.adminDomain || null}
      customerDomain={profile?.customerDomain || null}
    />
  );
}

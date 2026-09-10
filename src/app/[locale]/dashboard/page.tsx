import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { redirect } from "@/i18n/routing";
import { dashboardQuery } from "@/lib/queries/dashboard.query";
import DashboardClient from "./DashboardClient";
import DashboardOverview from "./DashboardOverview";
import { AuthorizedDashboardContext } from "@/types/auth";

export const dynamic = 'force-dynamic';

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
    // If context cannot be built (e.g. no active membership), we might show onboarding 
    // but the session isn't enough anymore.
    const userMock = {
       email: session.user.email,
       tenantStatus: session.user.tenantStatus,
       tenantOnboardingStatus: session.user.tenantOnboardingStatus
    };
    return <DashboardClient user={userMock as any} />;
  }

  const result = await dashboardQuery.execute(context);

  if (!result.success) {
    // If tenant is inactive, show the onboarding client
    if (result.error === "tenant_inactive" || result.error === "not_configured") {
      // Pass a simplified user object for the onboarding form
      const userMock = {
         email: session.user.email,
         tenantStatus: session.user.tenantStatus,
         tenantOnboardingStatus: session.user.tenantOnboardingStatus
      };
      return <DashboardClient user={userMock as any} />;
    }
    
    // For other errors, we could redirect or show an error state
    redirect({ href: '/login', locale });
    return null;
  }

  // If success, they see the normal overview
  return <DashboardOverview data={result.data} />;
}

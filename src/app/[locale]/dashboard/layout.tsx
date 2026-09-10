import { Link, redirect } from '@/i18n/routing';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getServerAuthContext } from '@/lib/auth/sessionContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SignOutButton } from '@/components/SignOutButton';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect({ href: '/login', locale: resolvedParams.locale });
    return null;
  }

  const context = await getServerAuthContext();
  if (context === "REQUIRE_TENANT_SELECTION") {
    redirect({ href: '/select-tenant' as any, locale: resolvedParams.locale });
    return null;
  }
  if (!context) {
    // No active tenant membership yet — DashboardClient renders its own
    // full-screen onboarding shell, no header/nav needed around it.
    return <>{children}</>;
  }

  // tunerportal itself has very little for an already-active tenant to do
  // here (the real product lives on their own deployed portal) — a single
  // slim header replaces the old 8-item sidebar, matching the dark/red
  // brand used everywhere else instead of the previous light/blue theme.
  const initials = (session.user.name || session.user.email || 'U').substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto w-full h-16 flex items-center justify-between px-4 sm:px-6">
          <Link href={"/" as any}>
            <Image src="/logo.png" alt="Tunerportal Logo" width={150} height={38} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" priority />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-white truncate max-w-[160px]">
                {session.user.name || session.user.email}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {children}
      </main>
    </div>
  );
}

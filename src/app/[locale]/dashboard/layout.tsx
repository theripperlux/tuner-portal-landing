import { Link, redirect } from '@/i18n/routing';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dashboardNavigation } from '@/config/dashboard-navigation';
import { authorizationPolicy } from '@/lib/auth/policy';
import { getServerAuthContext } from '@/lib/auth/sessionContext';

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
    // If user has no active tenant membership yet, render children directly (e.g. onboarding view)
    return <>{children}</>;
  }

  const allowedNavigation = dashboardNavigation.filter(item => 
    authorizationPolicy.authorize(context, item.requiredPermission)
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href={"/" as any}>
            <Image src="/logo.png" alt="Tunerportal Logo" width={160} height={50} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" priority />
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {allowedNavigation.map((item) => (
            <Link key={item.id} href={item.href as any} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white">
              <item.icon className="w-5 h-5 text-gray-500" />
              {item.labelId}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-8">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {session?.user?.name || session?.user?.email || ''}
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {(session?.user?.name || session?.user?.email || 'U').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

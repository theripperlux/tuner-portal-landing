import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { CreditCard, History, Plus, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
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
  if (!context || !context.permissions.has("credits:view")) {
    redirect({ href: '/dashboard', locale });
    return null;
  }

  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  // STRICT TenantScope isolation
  // 1. Fetch Membership for current credits
  const membership = await prisma.tenantMembership.findUnique({
    where: { id: context.membershipId }
  });

  // 2. Fetch Transactions
  const transactions = await prisma.creditTransaction.findMany({
    where: {
      tenantId: context.tenantId,
      membershipId: context.membershipId
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-indigo-500" />
            Billing & Credits
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your credit balance and view transaction history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Balance Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-indigo-100 font-medium text-sm uppercase tracking-wider mb-2">Available Balance</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">{membership?.credits || 0}</span>
              <span className="text-indigo-200 font-medium text-lg">Credits</span>
            </div>
            
            <button className="mt-8 w-full bg-white text-indigo-700 hover:bg-indigo-50 flex items-center justify-center py-3 rounded-xl font-semibold transition-colors shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Buy Credits
            </button>
            <p className="text-xs text-indigo-200 mt-3 text-center flex items-center justify-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Stripe checkout coming soon.
            </p>
          </div>
        </div>

        {/* History Table */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <History className="w-5 h-5 mr-2 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transaction History</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {transactions.length > 0 ? (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {transactions.map((tx) => (
                  <li key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'PURCHASE' || tx.type === 'REFUND' || tx.type === 'ADJUSTMENT' && tx.amount > 0
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {tx.type === 'PURCHASE' || tx.type === 'REFUND' || tx.type === 'ADJUSTMENT' && tx.amount > 0 ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.reason || tx.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tx.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${
                      tx.type === 'PURCHASE' || tx.type === 'REFUND' || tx.type === 'ADJUSTMENT' && tx.amount > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {tx.type === 'PURCHASE' || tx.type === 'REFUND' || tx.type === 'ADJUSTMENT' && tx.amount > 0 ? '+' : '-'}{Math.abs(tx.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">No transactions yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your credit history will appear here.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

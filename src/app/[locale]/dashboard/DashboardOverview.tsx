'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ExternalLink, Building2, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { DashboardOverview as DashboardOverviewType } from '@/types/dashboard';

/**
 * The real day-to-day product lives on the tenant's own deployed portal
 * (the domains configured during onboarding), not inside tunerportal — this
 * is the front door, not the application. So once a tenant is active,
 * there's genuinely little to do here beyond confirming the portal is live
 * and surfacing the links — not a second, smaller copy of a SaaS dashboard.
 */
export default function DashboardOverview({
  data,
  adminDomain,
  customerDomain,
}: {
  data: DashboardOverviewType;
  adminDomain: string | null;
  customerDomain: string | null;
}) {
  const t = useTranslations('Dashboard');
  const companyName = data.tenant.status === 'ready' ? data.tenant.data.name : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {companyName ? t('overviewWelcome', { name: companyName }) : t('overviewWelcomeGeneric')}
        </h1>
      </div>

      {/* Live status */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3 mb-6">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-white font-semibold text-lg leading-tight">{t('overviewLiveTitle')}</h2>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{t('overviewLiveDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adminDomain && (
            <a
              href={`https://${adminDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl px-5 py-4 transition-colors group"
            >
              <div className="min-w-0">
                <span className="inline-block px-2 py-0.5 bg-red-500/15 text-red-400 text-[10px] font-bold rounded uppercase mb-1.5">{t('overviewAdminPortalLabel')}</span>
                <p className="text-sm font-semibold text-white truncate">{adminDomain}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
            </a>
          )}
          {customerDomain && (
            <a
              href={`https://${customerDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-xl px-5 py-4 transition-colors group"
            >
              <div className="min-w-0">
                <span className="inline-block px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[10px] font-bold rounded uppercase mb-1.5">{t('overviewCustomerPortalLabel')}</span>
                <p className="text-sm font-semibold text-white truncate">{customerDomain}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Company recap + support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-4 h-4 text-gray-500" />
            <h3 className="text-white font-semibold text-sm">{t('overviewCompanyLabel')}</h3>
          </div>
          <p className="text-sm text-gray-300">{companyName}</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            <h3 className="text-white font-semibold text-sm">{t('support')}</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">{t('overviewNeedChanges')}</p>
          <Link href="mailto:support@tunerportal.com" className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-2 rounded-lg transition-all">
            <MessageCircle className="w-3.5 h-3.5" /> {t('contactSupport')}
          </Link>
        </div>
      </div>
    </div>
  );
}

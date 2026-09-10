import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { ArrowRight, Scale, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why TunerPortal? | Compare File Service Platforms',
  description: 'See how TunerPortal compares against manual workflows, traditional file services, and competitors.'
};

export default async function WhyTunerPortal() {
  const t = await getTranslations('WhyTunerportalPage');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors">
      <SiteNav />

      {/* HEADER */}
      <div className="pt-32 pb-16 border-b border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 text-black dark:text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 mb-6">
            <Scale className="w-4 h-4" /> {t('badge')}
          </span>
          <h1 className="font-['Archivo'] font-black text-4xl md:text-6xl uppercase tracking-tighter text-black dark:text-white mb-6">
            {t('heroTitle')} <span className="text-red-600 dark:text-red-400">{t('heroHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            {t('heroDesc')}
          </p>
        </div>
      </div>

      {/* COMPARISONS GRID */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] rounded-3xl p-8 shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col h-full hover:border-red-500/50 dark:hover:border-red-400/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-400/10 flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl font-bold font-['Archivo'] text-black dark:text-white mb-4">{t('card1Label')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
              {t('card1Desc')}
            </p>
            <Link href="/why/manual-workflow" className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2 hover:gap-3 transition-all">
              {t('readComparison')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] rounded-3xl p-8 shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col h-full hover:border-green-500/50 dark:hover:border-green-400/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center mb-6">
              <Scale className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold font-['Archivo'] text-black dark:text-white mb-4">{t('card2Label')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
              {t('card2Desc')}
            </p>
            <Link href="/why/traditional-portals" className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 hover:gap-3 transition-all">
              {t('readComparison')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] rounded-3xl p-8 shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col h-full hover:border-red-800/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-red-800/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-red-800 dark:text-red-800" />
            </div>
            <h3 className="text-2xl font-bold font-['Archivo'] text-black dark:text-white mb-4">{t('card3Label')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
              {t('card3Desc')}
            </p>
            <Link href="/why/competitors" className="font-bold text-red-800 dark:text-red-800 flex items-center gap-2 hover:gap-3 transition-all">
              {t('readComparison')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { ArrowRight, Briefcase, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TunerPortal Case Studies | Success Stories',
  description: 'See how tuning shops and file service providers scale their business using the TunerPortal AI Business Platform.'
};

export default async function CaseStudiesHub() {
  const t = await getTranslations('CaseStudiesPage');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors">
      <SiteNav />

      {/* HEADER */}
      <div className="pt-32 pb-16 border-b border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 text-black dark:text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 mb-6">
            <Briefcase className="w-4 h-4" /> {t('badge')}
          </span>
          <h1 className="font-['Archivo'] font-black text-4xl md:text-6xl uppercase tracking-tighter text-black dark:text-white mb-6">
            {t('heroTitle')} <span className="text-red-600 dark:text-red-400">{t('heroHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            {t('heroDesc')}
          </p>
        </div>
      </div>

      {/* CASE STUDIES GRID */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

          <Link href="/case-studies/beginner-workflow" className="group bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] rounded-3xl overflow-hidden shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col hover:border-red-500/50 dark:hover:border-red-400/50 transition-all hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-br from-red-500/20 to-red-600/20 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay opacity-30"></div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-3">{t('card1Tag')}</span>
              <h3 className="text-2xl font-bold font-['Archivo'] text-black dark:text-white mb-4 leading-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {t('card1Title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
                {t('card1Desc')}
              </p>
              <div className="font-bold text-black dark:text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                {t('readCaseStudy')} <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link href="/case-studies/tuning-shop" className="group bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] rounded-3xl overflow-hidden shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col hover:border-green-500/50 dark:hover:border-green-400/50 transition-all hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-br from-green-500/20 to-green-600/20 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay opacity-30"></div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-3">{t('card2Tag')}</span>
              <h3 className="text-2xl font-bold font-['Archivo'] text-black dark:text-white mb-4 leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {t('card2Title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
                {t('card2Desc')}
              </p>
              <div className="font-bold text-black dark:text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                {t('readCaseStudy')} <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link href="/case-studies/file-service" className="group bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] rounded-3xl overflow-hidden shadow-sm dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] flex flex-col hover:border-red-800/50 transition-all hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-br from-red-800/20 to-red-800/20 relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay opacity-30"></div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <span className="text-xs font-bold text-red-800 dark:text-red-800 uppercase tracking-widest mb-3">{t('card3Tag')}</span>
              <h3 className="text-2xl font-bold font-['Archivo'] text-black dark:text-white mb-4 leading-tight group-hover:text-red-800 dark:group-hover:text-red-800 transition-colors">
                {t('card3Title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 flex-1">
                {t('card3Desc')}
              </p>
              <div className="font-bold text-black dark:text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                {t('readCaseStudy')} <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}

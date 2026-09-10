import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { Database, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI ECU Tuning Software & Workflows | TunerPortal',
  description: 'Build your own AI tuning company. Automate workflows, routing, and support with our advanced AI builder.'
};

export default async function AiTuningPage() {
  const t = await getTranslations('AiEcuTuningPage');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors">
      <SiteNav />

      {/* HERO */}
      <div className="pt-32 pb-24 border-b border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-400/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-red-500/10 dark:bg-red-400/10 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-red-500/20 dark:border-red-400/20 mb-6">
            <Zap className="w-4 h-4" /> {t('badge')}
          </span>
          <h1 className="font-['Archivo'] font-black text-5xl md:text-7xl uppercase tracking-tighter text-black dark:text-white mb-6">
            {t('heroTitle')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500 dark:from-red-400 dark:to-green-400">{t('heroHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            {t('heroDesc')}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-xl">
              {t('ctaBtn')}
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] p-8 rounded-2xl shadow-sm dark:shadow-none hover:border-red-500/30 dark:hover:border-red-400/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 dark:bg-red-400/10 flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold font-['Archivo'] text-black dark:text-white mb-3">{t('feature1Title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('feature1Desc')}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400"/> {t('feature1Point1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400"/> {t('feature1Point2')}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] p-8 rounded-2xl shadow-sm dark:shadow-none hover:border-green-500/30 dark:hover:border-green-400/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold font-['Archivo'] text-black dark:text-white mb-3">{t('feature2Title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('feature2Desc')}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400"/> {t('feature2Point1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400"/> {t('feature2Point2')}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-white/[0.02] border border-black/10 dark:border-white/[0.05] p-8 rounded-2xl shadow-sm dark:shadow-none hover:border-red-800/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-800/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-red-800 dark:text-red-800" />
              </div>
              <h3 className="text-xl font-bold font-['Archivo'] text-black dark:text-white mb-3">{t('feature3Title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('feature3Desc')}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400"/> {t('feature3Point1')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400"/> {t('feature3Point2')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

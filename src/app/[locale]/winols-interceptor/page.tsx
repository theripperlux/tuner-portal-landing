import { useTranslations } from 'next-intl';
import { SiteNav } from '@/components/SiteNav';
import { Metadata } from 'next';
import { Bot, Zap, ShieldCheck, Activity, FolderCheck, MonitorPlay, FileEdit, Settings, Cog, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'WinOLS Interceptor & LuaBot | TunerPortal',
  description: 'Connect TunerPortal directly to your WinOLS via the LuaBot Interceptor. Fully automated tuning file processing.'
};

export default function WinolsInterceptorPage() {
  const t = useTranslations('Interceptor');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors">
      <SiteNav />

      {/* HERO SECTION */}
      <div className="pt-32 pb-16 relative overflow-hidden border-b border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 text-black dark:text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 mb-6">
            <Bot className="w-4 h-4 text-[#e8192c] dark:text-[#ff2d3f]" />
            WinOLS Automation
          </span>
          <h1 className="font-['Archivo'] font-black text-3xl md:text-5xl uppercase tracking-tighter text-black dark:text-white mb-6 leading-tight max-w-4xl mx-auto">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto whitespace-pre-wrap">
            {t('intro')}
          </p>
        </div>
      </div>

      {/* 1. Hauptfeatures & Automatisierung */}
      <div className="py-20 bg-gray-50 dark:bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-['Archivo'] font-bold text-black dark:text-white mb-4">
              {t('sec1_title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-xl">
              <Activity className="w-10 h-10 text-[#e8192c] dark:text-[#ff2d3f] mb-6" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">{t('sec1_1_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('sec1_1_desc')}</p>
            </div>

            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-xl">
              <Bot className="w-10 h-10 text-[#e8192c] dark:text-[#ff2d3f] mb-6" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">{t('sec1_2_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{t('sec1_2_desc')}</p>
            </div>

            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-xl">
              <Cog className="w-10 h-10 text-[#e8192c] dark:text-[#ff2d3f] mb-6" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">{t('sec1_3_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('sec1_3_desc')}</p>
            </div>

            <div className="bg-white dark:bg-[#111] p-8 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-xl">
              <Zap className="w-10 h-10 text-[#e8192c] dark:text-[#ff2d3f] mb-6" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">{t('sec1_4_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('sec1_4_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sicherheit & Stabilität */}
      <div className="py-20 bg-white dark:bg-[#0a0a0a] border-y border-black/5 dark:border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-['Archivo'] font-bold text-black dark:text-white mb-4">
              {t('sec2_title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-[#111] p-8 rounded-2xl border border-black/5 dark:border-white/[0.05]">
              <Clock className="w-10 h-10 text-red-500 mb-6" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">{t('sec2_1_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('sec2_1_desc')}</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#111] p-8 rounded-2xl border border-black/5 dark:border-white/[0.05]">
              <FolderCheck className="w-10 h-10 text-[#e8192c] dark:text-[#ff2d3f] mb-6" />
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">{t('sec2_2_title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('sec2_2_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Benutzeroberfläche & Dashboard */}
      <div className="py-20 bg-gray-50 dark:bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-['Archivo'] font-bold text-black dark:text-white mb-4">
              {t('sec3_title')}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-lg">
                <MonitorPlay className="w-8 h-8 text-[#e8192c] dark:text-[#ff2d3f] mb-4" />
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('sec3_1_title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{t('sec3_1_desc')}</p>
              </div>

              <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-lg">
                <FileEdit className="w-8 h-8 text-[#e8192c] dark:text-[#ff2d3f] mb-4" />
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('sec3_2_title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t('sec3_2_desc')}</p>
              </div>

              <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] shadow-lg">
                <Settings className="w-8 h-8 text-[#e8192c] dark:text-[#ff2d3f] mb-4" />
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('sec3_3_title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t('sec3_3_desc')}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e8192c]/20 to-[#ff2d3f]/20 blur-3xl rounded-full"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
                <img 
                  src="/screenshots/interceptor/dashbord.png" 
                  alt="WinOLS Interceptor Dashboard" 
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Erste Schritte & Einrichtung */}
      <div className="py-20 bg-white dark:bg-[#0a0a0a] border-t border-black/5 dark:border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-['Archivo'] font-bold text-black dark:text-white mb-4">
              {t('sec4_title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('sec4_intro')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] flex gap-4 items-start">
                <span className="w-8 h-8 bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-[#e8192c] dark:text-[#ff2d3f]">1</span>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t('sec4_1_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('sec4_1_desc')}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] flex gap-4 items-start">
                <span className="w-8 h-8 bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-[#e8192c] dark:text-[#ff2d3f]">2</span>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t('sec4_2_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('sec4_2_desc')}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] flex gap-4 items-start">
                <span className="w-8 h-8 bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-[#e8192c] dark:text-[#ff2d3f]">3</span>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t('sec4_3_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{t('sec4_3_desc')}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/[0.05] flex gap-4 items-start">
                <span className="w-8 h-8 bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-[#e8192c] dark:text-[#ff2d3f]">4</span>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{t('sec4_4_title')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{t('sec4_4_desc')}</p>
                  <div className="bg-white dark:bg-black p-3 rounded-lg border border-black/10 dark:border-white/10 text-xs font-mono text-gray-800 dark:text-gray-300">
                    Stage 1, Stage 2, DPF OFF, EGR OFF, Pop & Bang
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
                <img 
                  src="/screenshots/interceptor/settings1.png" 
                  alt="WinOLS Interceptor Settings" 
                  className="w-full h-auto object-cover" 
                />
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10">
                <img 
                  src="/screenshots/interceptor/settings2.png" 
                  alt="WinOLS Interceptor Advanced Settings" 
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
             <Link 
                href="/register" 
                className="inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-[1.02] transition-all shadow-xl"
              >
                Start Automated Tuning
              </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

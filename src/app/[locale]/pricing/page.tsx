'use client';

import { useTranslations } from 'next-intl';
import { SiteNav } from '@/components/SiteNav';
import { CheckCircle2, Cpu, Database, ChevronRight, MousePointerClick, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { sendGAEvent } from '@next/third-parties/google';
import { PricingCalculator } from '@/components/PricingCalculator';
import Image from 'next/image';

export default function PricingPage() {
  const t = useTranslations('PricingPage');

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 font-sans selection:bg-[#ff2d3f] selection:text-black">
      <SiteNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ff2d3f15_0%,transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto whitespace-pre-line">
            {t('desc')}
          </p>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 md:p-12 shadow-2xl border border-black/5 dark:border-white/10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#ff2d3f]">{t('explanationTitle')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('explanationIntro')}
            </p>
          </div>

          {/* Explanation Image */}
          <div className="mb-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg">
            <Image 
              src="/images/good-pricing.png" 
              alt="How our credit system works" 
              width={1200} 
              height={600} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* The Most Common Misunderstanding */}
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 mb-12">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> {t('explanationMisunderstandTitle')}
            </h3>
            <div className="text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-line leading-relaxed">
              {t('explanationMisunderstandDesc')}
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-8">
            {/* Option A */}
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5">
              <div className="md:w-1/3">
                <h4 className="text-xl font-bold text-[#ff2d3f] mb-2">{t('explanationOptionATitle')}</h4>
              </div>
              <div className="md:w-2/3 text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                {t('explanationOptionADesc')}
              </div>
            </div>

            {/* Option B */}
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5">
              <div className="md:w-1/3">
                <h4 className="text-xl font-bold text-[#ff2d3f] mb-2">{t('explanationOptionBTitle')}</h4>
              </div>
              <div className="md:w-2/3 text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                {t('explanationOptionBDesc')}
              </div>
            </div>

            {/* Option C */}
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5">
              <div className="md:w-1/3">
                <h4 className="text-xl font-bold text-[#ff2d3f] mb-2">{t('explanationOptionCTitle')}</h4>
              </div>
              <div className="md:w-2/3 text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                {t('explanationOptionCDesc')}
              </div>
            </div>

            {/* AI Solutions */}
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-gradient-to-r from-red-50 to-red-800 dark:from-red-900/10 dark:to-red-800/10 border border-red-200 dark:border-red-800/30">
              <div className="md:w-1/3">
                <h4 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">{t('explanationAITitle')}</h4>
              </div>
              <div className="md:w-2/3 text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {t('explanationAIDesc')}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-center">{t('explanationSummaryTitle')}</h3>
            <div className="text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-line leading-relaxed max-w-3xl mx-auto">
              {t('explanationSummaryDesc')}
            </div>
          </div>

        </div>
      </section>

      {/* Two Options Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Option A */}
          <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-white/5 relative overflow-hidden group hover:border-[#ff2d3f]/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-24 h-24 text-[#ff2d3f]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-[#ff2d3f]">{t('optionA_Title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('optionA_Desc')}</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-sm">{t('optionA_Bullet1')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                <span className="text-sm">{t('optionA_Bullet2')}</span>
              </li>
            </ul>
            <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/10">
              <p className="text-3xl font-black">{t('optionA_Price')} <span className="text-xl text-gray-500 font-medium">(5€)</span></p>
            </div>
          </div>

          {/* Option B */}
          <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Database className="w-24 h-24 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{t('optionB_Title')}</h2>
            <p className="text-gray-400 mb-6">{t('optionB_Desc')}</p>
            <div className="mt-auto pt-6 border-t border-white/10">
              <p className="text-sm font-medium text-gray-300 uppercase tracking-widest mb-2">Pricing</p>
              <p className="text-lg text-gray-200">See calculator below for details ↓</p>
            </div>
          </div>
        </div>

        {/* Auto Transfer Banner */}
        <div className="mt-8 bg-red-50 dark:bg-[#ff2d3f]/10 border border-red-200 dark:border-[#ff2d3f]/20 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <Database className="w-8 h-8 text-[#ff2d3f] shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-lg mb-1">{t('autoTransferTitle')}</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{t('autoTransferDesc')}</p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <PricingCalculator />
      </section>

      {/* Extra Modules & 1-Click Settings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4 text-[#ff2d3f]">
              <MousePointerClick className="w-8 h-8" />
              <h3 className="text-3xl font-bold">{t('pricing1ClickTitle')}</h3>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {t('pricing1ClickDesc')}
            </p>
            
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">{t('extraModulesTitle')}</h4>
              
              <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <h5 className="font-bold">{t('cvnPatchTitle')}</h5>
                  <p className="text-sm text-gray-500">Add-on for tuning files</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-xl text-[#ff2d3f]">{t('cvnPatchPrice')}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <h5 className="font-bold">{t('autoDtcTitle')}</h5>
                  <p className="text-sm text-gray-500">Per processed file</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-xl text-[#ff2d3f]">{t('autoDtcPrice')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group perspective">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2d3f] to-[#4ade80] rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white dark:bg-[#111] p-2 rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:rotate-x-2 group-hover:-rotate-y-2 group-hover:scale-[1.02]">
              <Image 
                src="/moeglichkeiten.png" 
                alt="1-Click Capabilities" 
                width={800} 
                height={500} 
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What belongs where? Categories List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">{t('categoryTitle')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('categoryDesc')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#111] border-t-4 border-[#ff2d3f] rounded-b-2xl p-6 shadow-xl shadow-black/5 dark:shadow-white/5">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#ff2d3f]"/> Tuning</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('catTuning')}</p>
          </div>
          
          <div className="bg-white dark:bg-[#111] border-t-4 border-[#ff2d3f] rounded-b-2xl p-6 shadow-xl shadow-black/5 dark:shadow-white/5">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#ff2d3f]"/> Deactivation</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('catDeact')}</p>
          </div>
          
          <div className="bg-white dark:bg-[#111] border-t-4 border-[#ff2d3f] rounded-b-2xl p-6 shadow-xl shadow-black/5 dark:shadow-white/5">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#ff2d3f]"/> Miscle</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('catMiscle')}</p>
          </div>
        </div>
      </section>

      {/* Combination Rules Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-4">{t('comboTitle')}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl">
            {t('comboDesc')}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
              <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">{t('comboEx1_Title')}</h4>
              <p className="font-mono text-lg font-bold text-[#e8192c] dark:text-[#ff2d3f]">{t('comboEx1_Desc')}</p>
            </div>
            
            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
              <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">{t('comboEx2_Title')}</h4>
              <p className="font-mono text-lg font-bold text-[#e8192c] dark:text-[#ff2d3f]">{t('comboEx2_Desc')}</p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
              <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">{t('comboEx3_Title')}</h4>
              <p className="font-mono text-lg font-bold text-[#e8192c] dark:text-[#ff2d3f]">{t('comboEx3_Desc')}</p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 border-l-4 border-l-[#ff2d3f]">
              <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">{t('comboEx4_Title')}</h4>
              <p className="font-mono text-lg font-bold text-[#e8192c] dark:text-[#ff2d3f]">{t('comboEx4_Desc')}</p>
            </div>
          </div>

          <div className="mt-12 bg-white dark:bg-[#111] p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-lg text-center">
            <h4 className="text-xl font-bold mb-3 text-[#ff2d3f]">{t('freedomTitle')}</h4>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('freedomDesc')}</p>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/register"
              onClick={() => sendGAEvent({ event: 'conversion', value: 'pricing_bottom_cta' })}
              className="inline-flex items-center px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold hover:scale-[1.02] transition-transform"
            >
              Portal erstellen <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

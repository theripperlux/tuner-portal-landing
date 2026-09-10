"use client";

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { 
  UploadCloud, Cpu, Trash2, MessageSquare, ShoppingCart, Key, BarChart3, Database, 
  Zap, Banknote, ShieldCheck, CreditCard, Briefcase, Receipt, Paintbrush, ArrowRight
} from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { sendGAEvent } from '@next/third-parties/google';

export default function FeaturesPage() {
  const t = useTranslations('Showcase');
  const tIndex = useTranslations('Index');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  const customerFeatures = [
    { icon: UploadCloud, title: t('customer.f1Title'), desc: t('customer.f1Desc') },
    { icon: Cpu, title: t('customer.f2Title'), desc: t('customer.f2Desc') },
    { icon: Trash2, title: t('customer.f3Title'), desc: t('customer.f3Desc') },
    { icon: MessageSquare, title: t('customer.f4Title'), desc: t('customer.f4Desc') },
    { icon: ShoppingCart, title: t('customer.f5Title'), desc: t('customer.f5Desc') },
    { icon: Key, title: t('customer.f6Title'), desc: t('customer.f6Desc') },
    { icon: BarChart3, title: t('customer.f7Title'), desc: t('customer.f7Desc') },
    { icon: Database, title: t('customer.f8Title'), desc: t('customer.f8Desc') },
  ];

  const adminFeatures = [
    { icon: Zap, title: t('admin.f1Title'), desc: t('admin.f1Desc') },
    { icon: Banknote, title: t('admin.f2Title'), desc: t('admin.f2Desc') },
    { icon: ShieldCheck, title: t('admin.f3Title'), desc: t('admin.f3Desc') },
    { icon: CreditCard, title: t('admin.f4Title'), desc: t('admin.f4Desc') },
    { icon: Briefcase, title: t('admin.f5Title'), desc: t('admin.f5Desc') },
    { icon: BarChart3, title: t('admin.f6Title'), desc: t('admin.f6Desc') },
    { icon: Receipt, title: t('admin.f7Title'), desc: t('admin.f7Desc') },
    { icon: Paintbrush, title: t('admin.f8Title'), desc: t('admin.f8Desc') },
  ];

  const currentFeatures = activeTab === 'customer' ? customerFeatures : adminFeatures;

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#050505] text-gray-600 dark:text-gray-300 font-sans selection:bg-[#ef4444] selection:text-white transition-colors duration-500">
      {/* Top Status Bar */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 py-2 px-4 flex justify-center items-center text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider transition-colors duration-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        {tIndex('systemStatus') || 'SYSTEM STATUS: ONLINE'}
      </div>

      {/* Main Navigation */}
      <SiteNav />

      {/* Features Hero */}
      <div className="py-24 relative overflow-hidden bg-[#f5f5f7] dark:bg-[#050505] transition-colors duration-500">
        {/* Subtle, elegant background mesh */}
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#e8192c]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-300 font-medium mb-8 backdrop-blur-sm transition-colors duration-500">
            <span className="text-[#e8192c] mr-2">✦</span> Enterprise-Grade Features
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight transition-colors duration-500">
            Discover the Complete <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-400 dark:from-white dark:to-gray-500">
              Tuning Ecosystem
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-16 font-light transition-colors duration-500">
            {t('subtitle')} Every tool you and your customers need to scale a modern tuning business effortlessly.
          </p>

          {/* Professional Toggle Switch */}
          <div className="inline-flex bg-white dark:bg-[#0f0f0f] p-1.5 rounded-xl border border-black/10 dark:border-white/10 relative z-20 shadow-sm dark:shadow-lg transition-colors duration-500">
            <button
              onClick={() => {
                setActiveTab('customer');
                sendGAEvent({ event: 'tab_click', value: 'features_customer' });
              }}
              className={"px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 " + (activeTab === 'customer' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5')}
            >
              {t('toggleCustomer')}
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                sendGAEvent({ event: 'tab_click', value: 'features_admin' });
              }}
              className={"px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 " + (activeTab === 'admin' ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5')}
            >
              {t('toggleAdmin')}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Features Grid */}
      <div className="pb-16 relative bg-[#f5f5f7] dark:bg-[#050505] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentFeatures.map((f, i) => (
              <div 
                key={activeTab + "-" + i} 
                className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl hover:border-black/20 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-[#0f0f0f] transition-all duration-300 group flex flex-col animate-in fade-in slide-in-from-bottom-4 shadow-sm"
                style={{ animationDelay: (i * 40) + "ms" }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] dark:bg-white/5 flex items-center justify-center mb-6 border border-black/5 dark:border-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <f.icon className="w-6 h-6 text-gray-900 dark:text-gray-100 transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 tracking-tight transition-colors duration-500">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow transition-colors duration-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Interface Showcase */}
      <div className="pb-32 bg-[#f5f5f7] dark:bg-[#050505] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-sm text-gray-600 dark:text-gray-300 font-medium mb-4 backdrop-blur-sm transition-colors duration-500">
              <span className="text-red-500 mr-2">👁️</span> Sneak Peek
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 transition-colors duration-500">Inside the Admin Panel</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-500">Take a closer look at the tools that power your tuning business. Everything you need, beautifully designed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium text-sm drop-shadow-md">File Services Workflow</span>
              </div>
              <Image src="/admin_fileservice_v1.png" alt="Admin File Services" width={1920} height={1080} className="w-full h-auto object-cover transition-transform duration-700" />
            </div>
            <div className="group relative rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium text-sm drop-shadow-md">Customer Management</span>
              </div>
              <Image src="/admin_customer_v1.png" alt="Admin Customers" width={1920} height={1080} className="w-full h-auto object-cover transition-transform duration-700" />
            </div>
            <div className="group relative rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium text-sm drop-shadow-md">Invoicing & Billing</span>
              </div>
              <Image src="/admin_invoices_v1.png" alt="Admin Invoices" width={1920} height={1080} className="w-full h-auto object-cover transition-transform duration-700" />
            </div>
            <div className="group relative rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium text-sm drop-shadow-md">Platform Settings</span>
              </div>
              <Image src="/admin_settings_v1.png" alt="Admin Settings" width={1920} height={1080} className="w-full h-auto object-cover transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-b from-[#f5f5f7] to-white dark:from-[#050505] dark:to-[#0a0a0a] text-center border-t border-black/5 dark:border-white/5 transition-colors duration-500">
         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight transition-colors duration-500">Ready to transform your business?</h2>
         <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto transition-colors duration-500">Join the world's fastest-growing network of tuning professionals. Setup takes less than 5 minutes.</p>
          <a
            href="/register"
            onClick={() => sendGAEvent({ event: 'cta_click', value: 'features_bottom_cta' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            {locale === 'de' ? 'Kostenlos testen' : 'Start Free Trial'}
            <ArrowRight className="w-4 h-4" />
          </a>
      </div>
    </div>
  );
}

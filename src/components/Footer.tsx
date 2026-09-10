'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bot, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-white dark:bg-[#050505] border-t border-gray-200 dark:border-white/5 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black tracking-tighter">
                Tuner<span className="text-red-600">Portal</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm">
              Create Your Own AI Tuning Portal for Free. Build your white-label business, automate ECU files, and scale faster.
            </p>
            <div className="flex gap-4 items-center text-sm text-gray-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500" /> SSL Secure</span>
              <span className="flex items-center gap-1"><Bot className="w-4 h-4 text-red-500" /> AI Powered</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-['Outfit']">Product</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><Link href="/ai-tuning-portal" className="hover:text-red-600 transition-colors">AI Tuning Portal</Link></li>
              <li><Link href="/white-label-tuning-portal" className="hover:text-red-600 transition-colors">White Label</Link></li>
              <li><Link href="/ecu-file-service" className="hover:text-red-600 transition-colors">ECU File Service</Link></li>
              <li><Link href="/reseller-management" className="hover:text-red-600 transition-colors">Reseller Management</Link></li>
              <li><Link href="/pricing" className="hover:text-red-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-['Outfit']">Resources</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><Link href="/blog" className="hover:text-red-600 transition-colors">Blog & Guides</Link></li>
              <li><Link href="/case-studies" className="hover:text-red-600 transition-colors">Case Studies</Link></li>
              <li><Link href="/demo" className="hover:text-red-600 transition-colors">Live Demo</Link></li>
              <li><Link href="/setup-guide" className="hover:text-red-600 transition-colors">Setup Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 font-['Outfit']">Legal</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li><Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/imprint" className="hover:text-red-600 transition-colors">Imprint</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-white/5">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} TunerPortal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             <Link href="/register" className="text-sm font-bold text-red-600 flex items-center gap-1 hover:gap-2 transition-all">
                Create Free AI Portal <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

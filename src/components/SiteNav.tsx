'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Menu, X, ChevronDown, Bot, LayoutTemplate, Users, FileCode2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { sendGAEvent } from '@next/third-parties/google';

// Delay (ms) before a hovered-open dropdown closes after the pointer leaves,
// so moving diagonally from the trigger into the panel doesn't flicker-close it.
const CLOSE_DELAY = 180;

export function SiteNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback((name: string) => {
    clearCloseTimer();
    setOpenDropdown(name);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenDropdown(null), CLOSE_DELAY);
  }, [clearCloseTimer]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  const solutions = [
    { href: '/ai-tuning-portal', label: 'AI Tuning Portal', desc: 'Your own AI-powered portal, live in minutes.', icon: Bot },
    { href: '/white-label-tuning-portal', label: 'White Label Portal', desc: '100% your brand — domain, logo, and colors.', icon: LayoutTemplate },
    { href: '/reseller-management', label: 'Reseller Management', desc: 'Manage dealers and sub-resellers at scale.', icon: Users },
    { href: '/ecu-file-service', label: 'ECU File Service', desc: 'Automated tuning file delivery, end to end.', icon: FileCode2 },
  ];

  const singleLinks = [
    { href: '/features', label: t('Index.navFeatures') || 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/demo', label: 'Live Demo' },
  ];

  const dropdowns = [
    { key: 'solutions', label: t('HomeRedesign.navSolutions') || 'Solutions', items: solutions },
  ];

  return (
    <nav ref={navRef} className="w-full bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 sticky top-0 z-50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <Link
          href="/"
          onClick={() => sendGAEvent({ event: 'nav_click', value: 'logo_home' })}
          className="flex items-center shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Tunerportal Logo"
            width={180}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-all duration-500"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex space-x-6 items-center">

          {dropdowns.map(({ key, label, items }) => {
            const isOpen = openDropdown === key;
            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => openMenu(key)}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : key)}
                  aria-expanded={isOpen}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors py-2"
                >
                  {label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Flush bridge (no gap) so the hover region stays continuous
                    from the trigger button into the panel below it. */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-80 z-50 transition-all duration-200 ease-out origin-top ${
                    isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-1.5 scale-[0.97] pointer-events-none'
                  }`}
                >
                  <div className="bg-white dark:bg-[#111115] border border-black/5 dark:border-white/10 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/40 p-2 overflow-hidden">
                    {items.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href as any}
                          onClick={() => setOpenDropdown(null)}
                          className="group flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <span className="mt-0.5 w-9 h-9 shrink-0 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-gray-900 dark:text-white">{item.label}</span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">{item.desc}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Single Links */}
          {singleLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href as any}
              onClick={() => sendGAEvent({ event: 'nav_click', value: l.label })}
              className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}

        </div>

        {/* Right Side Tools & High Conversion CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <Link
            href="/login"
            className="hidden lg:flex items-center justify-center font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors px-3 py-2"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="hidden lg:flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-full transition-transform hover:scale-[1.02] shadow-md shadow-red-500/20"
          >
            Create Free AI Portal
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="p-2 -mr-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-black/5 dark:border-white/5 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl h-screen overflow-y-auto pb-24">
          <div className="px-4 py-5 flex flex-col space-y-4">

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('HomeRedesign.navSolutions') || 'Solutions'}</p>
              <div className="flex flex-col space-y-2 pl-2 border-l border-black/10 dark:border-white/10">
                {solutions.map(l => (
                  <Link key={l.href} href={l.href as any} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              {singleLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href as any}
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold text-black dark:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/setup-guide"
                onClick={() => setOpen(false)}
                className="text-sm font-bold text-red-600 dark:text-red-400 pt-2"
              >
                Setup Guide
              </Link>
            </div>

            <div className="py-2">
              <LanguageSwitcher />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-black/5 dark:border-white/5">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full text-center py-3 rounded-md border border-black/10 dark:border-white/10 text-sm font-medium text-black dark:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="w-full text-center py-3 rounded-md bg-red-500 text-white font-bold shadow-lg"
              >
                Create Free AI Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

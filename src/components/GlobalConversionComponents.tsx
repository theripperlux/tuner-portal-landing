'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Calendar, DownloadCloud, Rocket } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { sendGAEvent } from '@next/third-parties/google';

export function GlobalConversionComponents() {
  const t = useTranslations();
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownExitPopup, setHasShownExitPopup] = useState(false);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('tp_exit_popup') === 'true') {
        setHasShownExitPopup(true);
      }
    }

    // Show floating button after scrolling down
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloating(true);
      } else {
        setShowFloating(false);
      }
    };

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitPopup) {
        setShowExitPopup(true);
        setHasShownExitPopup(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tp_exit_popup', 'true');
        }
        sendGAEvent({ event: 'exit_popup_trigger', value: 'triggered' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShownExitPopup]);

  return (
    <>
      {/* Floating Demo Button (Bottom Right) — stacked above the LiveChat bubble
          (fixed bottom-6 right-6, z-50) so the two floating widgets never overlap. */}
      <div
        className={`fixed bottom-24 right-6 z-40 transition-all duration-500 transform ${showFloating ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <Link 
          href="/demo"
          onClick={() => sendGAEvent({ event: 'conversion_click', value: 'floating_demo' })}
          className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-[1.02] transition-all group"
        >
          <Calendar className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
          {t('HomeRedesign.navBookDemo') || 'Book Demo'}
        </Link>
      </div>

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-3xl p-8 max-w-lg w-full relative shadow-2xl animate-in zoom-in-95 duration-500">
            
            <button 
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
              {t('HomeRedesign.exitPopupTitle') || 'Stop struggling with manual file services.'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              {t('HomeRedesign.exitPopupText') || 'Get our Free Guide: How to Start and Scale Your Own Tuning Business on Autopilot.'}
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendGAEvent({ event: 'lead_magnet_submit', value: 'guide_downloaded' });
                setShowExitPopup(false);
                alert('Guide sent to your email! (Demo)');
              }}
              className="flex flex-col gap-3"
            >
              <input 
                type="email" 
                placeholder="Your best email address" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-black dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-[#ef4444] text-white font-bold text-lg py-4 rounded-xl hover:bg-red-600 hover:scale-[1.02] transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
              >
                <DownloadCloud className="w-5 h-5" />
                {t('HomeRedesign.exitPopupBtn') || 'Download Free Guide'}
              </button>
            </form>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              We respect your privacy. No spam.
            </p>

          </div>
        </div>
      )}
    </>
  );
}

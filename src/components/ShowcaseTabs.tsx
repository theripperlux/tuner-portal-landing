'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { LayoutDashboard, ShieldCheck, MonitorPlay } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ShowcaseTabs({ isDe }: { isDe: boolean }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'customer' | 'admin'>('customer');
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = {
    customer: {
      id: 'customer',
      title: isDe ? 'Customer Portal' : 'Customer Portal',
      icon: <MonitorPlay className="w-5 h-5" />,
      screens: [
        { title: 'Dashboard', desc: isDe ? 'Credit Wallet, Active Files, Support Tickets' : 'Credit Wallet, Active Files, Support Tickets', imgLight: '/screenshots/Customerdashbord_light.png', imgDark: '/screenshots/customerdashbord_dark.png' },
        { title: 'File Upload Wizard', desc: isDe ? 'ECU Upload, Auto Detection, Vehicle Selection' : 'ECU Upload, Auto Detection, Vehicle Selection', imgLight: '/screenshots/fileupload_light.png', imgDark: '/screenshots/fileupload_dark.png' },
        { title: 'Solution Selection', desc: isDe ? 'Stage 1, Stage 2, DTC, Live Pricing' : 'Stage 1, Stage 2, DTC, Live Pricing', imgLight: '/screenshots/pricing_light.png', imgDark: '/screenshots/pricing_dark.png' }, // using pricing as fallback
        { title: 'Live Chat', desc: isDe ? 'Direkter Kontakt, Dateianhänge, Status' : 'Direct contact, Attachments, Status', imgLight: '/screenshots/chat_light.png', imgDark: '/screenshots/chat_dark.png' },
        { title: 'Invoices & Documents', desc: isDe ? 'Rechnungen, PDF Download, Bestellungen' : 'Invoices, PDF Download, Orders', imgLight: '/screenshots/invoce_light.png', imgDark: '/screenshots/invoce_dark.png' }
      ]
    },
    admin: {
      id: 'admin',
      title: isDe ? 'Admin Platform' : 'Admin Platform',
      icon: <ShieldCheck className="w-5 h-5" />,
      screens: [
        { title: 'Business Dashboard', desc: isDe ? 'Umsatz, Kunden, Files, Tickets, Credits' : 'Revenue, Customers, Files, Tickets', imgLight: '/screenshots/admin_platform_light.png', imgDark: '/screenshots/admin_platform_Dark.png' },
        { title: 'File Service Queue', desc: isDe ? 'Neue Dateien, In Bearbeitung, Abgeschlossen' : 'New Files, In Progress, Completed', imgLight: '/screenshots/Fileservice_light.png', imgDark: '/screenshots/filesservice_dark.png' },
        { title: 'Customer CRM', desc: isDe ? 'Kundenliste, Credits, Gruppen, Status' : 'Customer list, Credits, Groups', imgLight: '/screenshots/USERCRM_LIGHT.png', imgDark: '/screenshots/USERCRM_DARK.png' },
        { title: 'Pricing Management', desc: isDe ? 'Preisgruppen, Margen, DTC Preise' : 'Pricing groups, Margins, DTC Prices', imgLight: '/screenshots/pricing_light.png', imgDark: '/screenshots/pricing_dark.png' },
        { title: 'White Label Settings', desc: isDe ? 'Logo, Farben, Domain, Branding' : 'Logo, Colors, Domain, Branding', imgLight: '/screenshots/withlabelsettings_light.png', imgDark: '/screenshots/withlabelsettings_dark.png' },
        { title: 'Integrations', desc: isDe ? 'AutoTuner, Flex, KESS3, Stripe, PayPal' : 'AutoTuner, Flex, KESS3, Stripe', imgLight: '/screenshots/autodata_light.png', imgDark: '/screenshots/autodata_dark.png' }
      ]
    }
  };

  const currentCategory = categories[activeCategory];
  const currentScreen = currentCategory.screens[activeScreenIndex];

  // Provide fallback to dark if theme is not resolved
  const isLight = mounted && resolvedTheme === 'light';
  const currentImg = isLight ? currentScreen.imgLight : currentScreen.imgDark;

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close fullscreen on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-16 animate-in fade-in duration-700 relative">
      
      {/* CATEGORY TABS */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        {Object.values(categories).map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setActiveScreenIndex(0);
            }}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 ${
              activeCategory === cat.id 
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-xl scale-105' 
                : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
            }`}
          >
            {cat.icon} {cat.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          {currentCategory.screens.map((screen, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreenIndex(idx)}
              className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                activeScreenIndex === idx
                  ? 'bg-white dark:bg-[#111] border-red-500 dark:border-red-400 shadow-lg scale-[1.02]'
                  : 'bg-transparent border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-gray-500'
              }`}
            >
              <h4 className={`text-lg font-bold mb-2 font-['Archivo'] ${activeScreenIndex === idx ? 'text-black dark:text-white' : ''}`}>
                {screen.title}
              </h4>
              <p className={`text-sm ${activeScreenIndex === idx ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                {screen.desc}
              </p>
            </button>
          ))}
        </div>

        {/* IMAGE PREVIEW AREA */}
        <div className="w-full lg:w-2/3">
          <div className="sticky top-24 bg-gray-100 dark:bg-black rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.05)] relative aspect-[16/10] flex items-center justify-center transition-all duration-500">
            {/* Header Mockup */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 dark:bg-[#111] border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="mx-auto bg-white dark:bg-black/50 text-gray-500 text-[10px] px-4 py-1 rounded-full font-mono">
                portal.tunerportal.com
              </div>
            </div>
            
            <div className="absolute inset-0 top-8 z-10">
              <Image 
                src={currentImg} 
                alt={currentScreen.title}
                fill
                className="object-cover object-top animate-in fade-in duration-500"
                unoptimized
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

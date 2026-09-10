'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { CheckCircle2 } from 'lucide-react';

const slides = [
  { light: '/screenshots/Customerdashbord_light.png', dark: '/screenshots/customerdashbord_dark.png' },
  { light: '/screenshots/fileupload_light.png', dark: '/screenshots/fileupload_dark.png' },
  { light: '/screenshots/pricing_light.png', dark: '/screenshots/pricing_dark.png' },
  { light: '/screenshots/admin_platform_light.png', dark: '/screenshots/admin_platform_Dark.png' },
  { light: '/screenshots/USERCRM_LIGHT.png', dark: '/screenshots/USERCRM_DARK.png' }
];

export function HeroSlider() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // Slide every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  return (
    <div className="w-full lg:w-7/12 relative">
      <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-black rounded-3xl border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-500">
        
        {/* Fake Browser Header */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 dark:bg-[#111] border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2 z-20">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <div className="mx-auto bg-white dark:bg-black/50 text-gray-500 text-[10px] px-4 py-1 rounded-full font-mono">
            portal.tunerportal.com
          </div>
        </div>

        {/* Slides */}
        <div className="absolute inset-0 top-8 z-10">
          {slides.map((slide, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
               <Image 
                  src={isLight ? slide.light : slide.dark} 
                  alt={`Screenshot ${idx}`}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Floating Element */}
      <div className="absolute -bottom-8 -left-8 bg-white dark:bg-[#15151a] p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl hidden md:block z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold">API Status</div>
            <div className="text-xs text-gray-500">All systems operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}

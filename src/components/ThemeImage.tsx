'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function ThemeImage({ light, dark, alt }: { light: string, dark: string, alt: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';
  const currentImg = isLight ? light : dark;

  return (
    <div className="my-10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl relative bg-gray-100 dark:bg-[#111]">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 dark:bg-[#1a1a1a] border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2 z-20">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className="mx-auto bg-white dark:bg-black/50 text-gray-500 text-[10px] px-4 py-1 rounded-full font-mono">
          portal.tuning-company.com
        </div>
      </div>
      <div className="mt-8 relative aspect-[16/10] w-full">
        <Image 
          src={currentImg} 
          alt={alt}
          fill
          unoptimized
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

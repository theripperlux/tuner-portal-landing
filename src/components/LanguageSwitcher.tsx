"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

const locales = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'no', name: 'Norsk' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'sv', name: 'Svenska' }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-white uppercase transition-colors" aria-haspopup="true">
        {locale}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      <div className="absolute top-full right-0 mt-2 w-32 bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-[2px] shadow-[0_0_30px_rgba(239,68,68,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="py-2">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => router.replace(pathname as any, { locale: l.code })}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${locale === l.code ? 'text-red-500 font-bold' : 'text-gray-300 hover:text-white'}`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

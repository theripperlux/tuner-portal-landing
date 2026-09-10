'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export function SignOutButton({ className }: { className?: string }) {
  const t = useTranslations('Dashboard');
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={twMerge(
        'flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 px-3 py-2 rounded-lg transition-all',
        className
      )}
    >
      <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">{t('logout')}</span>
    </button>
  );
}

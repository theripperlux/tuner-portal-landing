'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

/**
 * Small copy-to-clipboard affordance for technical values (CNAME targets,
 * API keys, etc.) that a user needs to paste elsewhere. Shows a transient
 * "Copied" state instead of a browser alert/toast.
 */
export function CopyButton({ value, className }: { value: string; className?: string }) {
  const t = useTranslations('Dashboard');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (rare, e.g. insecure context) — fail silently,
      // the value is still visible and select-all-able as a fallback.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={twMerge(
        'inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white',
        className
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? t('copied') : t('copyToClipboard')}
    </button>
  );
}

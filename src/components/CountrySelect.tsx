'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, flagEmoji, resolveCountryName } from '@/lib/countries';

interface CountrySelectProps {
  value: string; // ISO-2 code, e.g. "DE"
  onChange: (code: string) => void;
  placeholder?: string;
  required?: boolean;
}

/**
 * Searchable, keyboard-friendly country picker styled to match the
 * landing register form's dark glassmorphism inputs. Stores the ISO-2
 * code (same canonical value the admin/backend use). Zero dependencies
 * beyond lucide icons.
 */
export function CountrySelect({
  value,
  onChange,
  placeholder = 'Select country *',
  required,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedLabel = value ? resolveCountryName(value) : '';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.value.toLowerCase() === q ||
        c.value.toLowerCase().startsWith(q),
    );
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Focus the search box when opening.
  useEffect(() => {
    if (open) {
      setQuery('');
      const id = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      {/* Hidden input carries the value so native `required` form
          validation still works on submit. */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        value={value}
        onChange={() => {}}
        className="sr-only absolute h-0 w-0 opacity-0"
      />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
      >
        <span className="flex items-center gap-2 min-w-0">
          {value ? (
            <>
              <span className="text-base leading-none">{flagEmoji(value)}</span>
              <span className="text-white truncate">{selectedLabel}</span>
            </>
          ) : (
            <span className="text-gray-600">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full bg-transparent py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
              />
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">
                No matches
              </li>
            ) : (
              filtered.map((c) => {
                const active = c.value === value;
                return (
                  <li key={c.value}>
                    <button
                      type="button"
                      onClick={() => select(c.value)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-left transition-colors ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-base leading-none">
                          {flagEmoji(c.value)}
                        </span>
                        <span className="truncate">{c.label}</span>
                      </span>
                      {active && (
                        <Check className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

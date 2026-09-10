'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FaqItem {
  q: string;
  a: string;
}

/**
 * A compact, two-column FAQ list. Deliberately styled differently from
 * `ui/Accordion` (boxed cards + chevron) — this is a borderless list with a
 * rotating plus/minus toggle, so large FAQ sets (15-20+ items) stay scannable
 * instead of turning into a wall of stacked cards.
 *
 * Uses the CSS grid-template-rows 0fr/1fr technique so height animates
 * correctly regardless of content length, without measuring anything in JS.
 */
export function FaqAccordion({ items, columns = 1 }: { items: FaqItem[]; columns?: 1 | 2 }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div
      className={twMerge(
        'grid grid-cols-1 gap-x-10',
        columns === 2 && 'lg:grid-cols-2'
      )}
    >
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border-b border-gray-200 dark:border-white/10"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 text-left py-4 group"
            >
              <span
                className={twMerge(
                  'font-semibold text-[15px] leading-snug transition-colors duration-200',
                  isOpen ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500'
                )}
              >
                {item.q}
              </span>
              <span
                className={twMerge(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                  isOpen
                    ? 'rotate-45 border-red-500 text-red-500'
                    : 'border-gray-300 text-gray-400 dark:border-white/20 dark:text-gray-500 group-hover:border-red-400 group-hover:text-red-500'
                )}
              >
                <Plus className="w-3.5 h-3.5" />
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="pb-4 pr-9 text-[14.5px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

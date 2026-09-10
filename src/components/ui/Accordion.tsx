'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-semibold transition-colors hover:text-primary"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={twMerge(
            'h-5 w-5 text-gray-500 transition-transform duration-300 ease-out',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>
      {/* CSS grid 0fr/1fr trick: animates smoothly to the content's real
          height regardless of length, unlike a fixed max-height. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge('w-full rounded-2xl border border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-[#111115]', className)}>
      {children}
    </div>
  );
}

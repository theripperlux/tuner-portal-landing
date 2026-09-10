import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HeroModule as HeroModuleType } from '@/types/modules';
import { Button } from '../ui/Button';

interface Props {
  module: HeroModuleType;
}

export function HeroModule({ module }: Props) {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-secondary">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">
        <h1 className="font-['Outfit'] font-bold text-5xl md:text-6xl mb-8 leading-tight">
          {module.title}
        </h1>
        {module.subtitle && (
          <p className="text-xl text-secondary-fg mb-10 leading-relaxed max-w-3xl mx-auto opacity-80">
            {module.subtitle}
          </p>
        )}
        {module.ctaText && module.ctaLink && (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={module.ctaLink}>
                {module.ctaText} <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

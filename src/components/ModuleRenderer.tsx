import React from 'react';
import { ContentModule } from '@/types/modules';

// Import newly extracted modules
import { HeroModule } from './modules/HeroModule';
import { BenefitsModule } from './modules/BenefitsModule';
import { FAQModule } from './modules/FAQModule';
import { ScreenshotsModule } from './modules/ScreenshotsModule';
import { RichTextModule } from './modules/RichTextModule';
import { FeatureGridModule } from './modules/FeatureGridModule';
import { StatisticsModule } from './modules/StatisticsModule';
import { TestimonialsModule } from './modules/TestimonialsModule';
import { ComparisonTableModule } from './modules/ComparisonTableModule';
import PricingTableModule from './modules/PricingTableModule';

interface ModuleRendererProps {
  modules: ContentModule[];
  locale?: string;
}

export function ModuleRenderer({ modules, locale }: ModuleRendererProps) {
  if (!modules || modules.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {modules.map((module, index) => {
        switch (module._type) {
          case 'hero':
            return <HeroModule key={index} module={module} />;
            
          case 'benefits':
            return <BenefitsModule key={index} module={module} />;
            
          case 'richText':
            return <RichTextModule key={index} module={module} />;
            
          case 'faq':
            return <FAQModule key={index} module={module} />;

          case 'screenshots':
            return <ScreenshotsModule key={index} module={module} />;

          case 'featureGrid':
            return <FeatureGridModule key={index} module={module} />;

          case 'statistics':
            return <StatisticsModule key={index} module={module} />;

          case 'testimonials':
            return <TestimonialsModule key={index} module={module} />;

          case 'comparisonTable':
            return <ComparisonTableModule key={index} module={module} locale={locale} />;

          case 'pricingTable':
            return <PricingTableModule key={index} module={module} />;

          case 'cta':
            // Placeholders for future implementations
            return <div key={index} className="hidden" data-module={module._type} />;

          default:
            // Exhaustive check
            const _exhaustiveCheck: never = module as never;
            console.warn('Unknown module type:', module);
            return null;
        }
      })}
    </div>
  );
}

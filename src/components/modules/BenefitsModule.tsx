import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BenefitsModule as BenefitsModuleType } from '@/types/modules';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface Props {
  module: BenefitsModuleType;
}

export function BenefitsModule({ module }: Props) {
  if (!module.items || module.items.length === 0) return null;
  return (
    <div className="mb-16 max-w-[1000px] mx-auto px-6 lg:px-12 w-full">
      {module.title && <h2 className="text-3xl font-bold font-['Outfit'] mb-6 text-foreground">{module.title}</h2>}
      <ul className="space-y-6">
        {module.items.map((item, i) => (
          <li key={i}>
            <Card className="flex items-start gap-4 p-6 hover:border-primary transition-colors">
              <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">{item.title}</h3>
                <span className="text-secondary-fg opacity-80 leading-relaxed">{item.description}</span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

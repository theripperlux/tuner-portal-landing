import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Shield, 
  Zap, 
  BarChart, 
  Settings, 
  Users, 
  FileText 
} from 'lucide-react';
import { FeatureGridModule as FeatureGridModuleType, AllowedIcons } from '@/types/modules';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { twMerge } from 'tailwind-merge';
import { getPublishableItems } from '@/utils/statusFilter';

interface Props {
  module: FeatureGridModuleType;
}

const iconMap: Record<AllowedIcons, React.ElementType> = {
  check: CheckCircle2,
  star: Star,
  shield: Shield,
  zap: Zap,
  chart: BarChart,
  settings: Settings,
  users: Users,
  file: FileText,
};

export function FeatureGridModule({ module }: Props) {
  const publishableItems = getPublishableItems(module.items);
  
  // Requirement: Empty modules should not be rendered
  if (!publishableItems || publishableItems.length === 0) return null;

  const cols = module.columns || 3;
  const isCompact = module.variant === 'compact';
  const hasScreenshots = module.variant === 'with-screenshots';
  const hasIcons = module.variant === 'with-icons';

  const gridClass = twMerge(
    'grid gap-6',
    cols === 2 ? 'grid-cols-1 md:grid-cols-2' :
    cols === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  );

  return (
    <section className="py-20 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
      {(module.heading || module.description) && (
        <div className="text-center mb-16 max-w-3xl mx-auto">
          {module.heading && (
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-6 text-foreground">
              {module.heading}
            </h2>
          )}
          {module.description && (
            <p className="text-lg text-secondary-fg opacity-80 leading-relaxed">
              {module.description}
            </p>
          )}
        </div>
      )}

      <ul className={gridClass}>
        {publishableItems.map((item) => {
          const isHighlighted = item.isHighlighted;
          const IconComponent = item.icon ? iconMap[item.icon] : CheckCircle2;
          
          return (
            <li key={item.id} className="flex h-full">
              <Card 
                className={twMerge(
                  'flex flex-col w-full overflow-hidden transition-all duration-300',
                  isHighlighted ? 'border-primary shadow-md ring-1 ring-primary/20' : 'hover:border-primary/50'
                )}
              >
                {hasScreenshots && item.image && (
                  <div className="w-full aspect-[4/3] relative bg-secondary overflow-hidden border-b border-secondary">
                    <Image 
                      src={item.image} 
                      alt={item.imageAlt || item.title} 
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <CardContent className={twMerge('flex flex-col flex-1', hasScreenshots ? 'p-6' : 'p-8')}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {hasIcons && (
                      <div className="p-3 bg-secondary rounded-xl text-primary shrink-0">
                        <IconComponent className="w-6 h-6" aria-hidden="true" />
                      </div>
                    )}
                    
                    <div className="flex flex-col items-end gap-2 shrink-0 ml-auto">
                      {item.category && (
                        <span className="text-xs font-bold uppercase tracking-wider text-secondary-fg opacity-60">
                          {item.category}
                        </span>
                      )}
                      {item.badge && (
                        <Badge variant={isHighlighted ? 'default' : 'secondary'}>
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground font-['Outfit']">
                    {item.title}
                  </h3>
                  
                  <p className={twMerge('text-secondary-fg opacity-80 leading-relaxed mb-6 flex-1', isCompact ? 'text-sm' : 'text-base')}>
                    {item.description}
                  </p>

                  {(item.link || item.cta) && (
                    <div className="mt-auto pt-4 border-t border-secondary flex flex-wrap items-center gap-4">
                      {item.link && (
                        <Link 
                          href={item.link.href}
                          target={item.link.type === 'external' ? '_blank' : '_self'}
                          rel={item.link.type === 'external' ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                        >
                          {item.link.label} <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                        </Link>
                      )}
                      {item.cta && (
                        <Button size="sm" asChild variant={isHighlighted ? 'default' : 'secondary'}>
                          <Link 
                            href={item.cta.href}
                            target={item.cta.type === 'external' ? '_blank' : '_self'}
                            rel={item.cta.type === 'external' ? 'noopener noreferrer' : undefined}
                          >
                            {item.cta.label}
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

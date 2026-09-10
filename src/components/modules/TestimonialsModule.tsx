import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quote, BadgeCheck } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { TestimonialsModule as TestimonialsModuleType } from '@/types/modules';
import { getPublishableTestimonials } from '@/utils/statusFilter';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface Props {
  module: TestimonialsModuleType;
}

export function TestimonialsModule({ module }: Props) {
  const publishableItems = getPublishableTestimonials(module.items);

  if (!publishableItems || publishableItems.length === 0) return null;

  const variant = module.variant || 'grid';

  const containerClasses = twMerge(
    'w-full max-w-[1200px] mx-auto px-6 lg:px-12 py-20',
    variant === 'horizontal-scroll' && 'overflow-hidden'
  );

  const listClasses = twMerge(
    'gap-6',
    variant === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    variant === 'horizontal-scroll' && 'flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 -mx-6 px-6 md:-mx-12 md:px-12 scrollbar-hide',
    variant === 'single' && 'max-w-4xl mx-auto flex flex-col',
    variant === 'featured' && 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center',
    variant === 'logo-quote' && 'grid grid-cols-1 md:grid-cols-2 gap-8'
  );

  return (
    <section className={containerClasses}>
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

      <ul className={listClasses}>
        {publishableItems.map((item) => {
          const isFeatured = variant === 'featured' || item.featured;
          
          return (
            <li 
              key={item.id} 
              className={twMerge(
                'flex h-full',
                variant === 'horizontal-scroll' && 'snap-center shrink-0 w-[85vw] md:w-[400px]',
                variant === 'featured' && 'lg:col-span-12'
              )}
            >
              <Card className={twMerge(
                'w-full border-secondary bg-background relative',
                isFeatured ? 'p-8 md:p-12 border-primary/20 shadow-xl ring-1 ring-primary/10 bg-primary/5' : 'p-6 md:p-8 hover:border-primary/30 transition-colors'
              )}>
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-10">
                    <Quote className="w-12 h-12 text-primary" aria-hidden="true" />
                  </div>
                  
                  {item.logo && (
                    <div className="mb-6 h-8 relative w-32">
                      <Image 
                        src={item.logo} 
                        alt={item.logoAlt || 'Company Logo'} 
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  )}

                  <blockquote className={twMerge(
                    "flex-1 relative z-10 font-medium text-foreground",
                    isFeatured ? "text-xl md:text-2xl leading-relaxed mb-8" : "text-base md:text-lg leading-relaxed mb-6 italic opacity-90"
                  )}>
                    "{item.quote}"
                  </blockquote>
                  
                  {item.translated && (
                    <p className="text-xs text-secondary-fg opacity-60 mb-6 italic">
                      Translated from original.
                    </p>
                  )}

                  <div className="mt-auto pt-6 border-t border-secondary flex flex-wrap items-center gap-4">
                    {item.image && !item.anonymized && (
                      <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 border-2 border-primary/20">
                        <Image 
                          src={item.image} 
                          alt={item.imageAlt || item.name || 'Customer'} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <cite className="flex flex-col not-italic">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {item.anonymized ? (item.displayName || 'Verified Customer') : (item.name || item.displayName)}
                        </span>
                        {item.verifiedAt && (
                          <span title="Verified Customer">
                            <BadgeCheck className="w-4 h-4 text-success" aria-hidden="true" />
                            <span className="sr-only">Verified</span>
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-secondary-fg opacity-80">
                        {item.role && <>{item.role}</>}
                        {item.role && item.company && <>, </>}
                        {item.company && <span className="font-medium text-foreground">{item.company}</span>}
                      </span>
                    </cite>

                    {item.caseStudyLink && (
                      <Link 
                        href={item.caseStudyLink}
                        className="ml-auto inline-flex items-center text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                      >
                        Read Case Study <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      {module.cta && (
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link 
              href={module.cta.href}
              target={module.cta.type === 'external' ? '_blank' : '_self'}
              rel={module.cta.type === 'external' ? 'noopener noreferrer' : undefined}
            >
              {module.cta.label}
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

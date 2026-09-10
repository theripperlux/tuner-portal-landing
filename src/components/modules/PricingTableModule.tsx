import React from 'react';
import { PricingTableModule, PricingPlan, PricingFeature, PricingLimit, PricingAmount } from '@/types/modules';
import { getPublishablePricingPlan } from '@/utils/statusFilter';
import { formatMinorAmount } from '@/utils/formatters';
import { useLocale } from 'next-intl';
import { Check, Minus, Info } from 'lucide-react';

export default function PricingTableModuleComponent({ module }: { module: PricingTableModule }) {
  const locale = useLocale();
  const now = new Date();

  // 1. Filter out unpublished/expired plans and sub-elements
  const publishablePlans = module.plans
    .map(plan => getPublishablePricingPlan(plan, now))
    .filter((plan): plan is PricingPlan => plan !== null);

  if (publishablePlans.length === 0) return null;

  // Render Features list for a plan
  const renderFeatures = (features: PricingFeature[]) => {
    return (
      <ul className="mt-8 space-y-4" role="list">
        {features.map(feat => {
          const isIncluded = feat.included === true || typeof feat.included === 'string';
          return (
            <li key={feat.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {feat.included === true ? (
                  <>
                    <span className="sr-only">Included</span>
                    <Check className="w-5 h-5 text-primary" aria-hidden="true" />
                  </>
                ) : feat.included === false ? (
                  <>
                    <span className="sr-only">Not included</span>
                    <Minus className="w-5 h-5 text-secondary-fg opacity-40" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Included: {feat.included}</span>
                    <Check className="w-5 h-5 text-primary" aria-hidden="true" />
                  </>
                )}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${feat.included === false ? 'text-secondary-fg opacity-60' : 'text-foreground'}`}>
                  {feat.label}
                  {typeof feat.included === 'string' && (
                    <span className="ml-1 font-semibold">({feat.included})</span>
                  )}
                  {feat.footnoteRefs?.map(ref => {
                    const fn = module.footnotes?.find(f => f.id === ref);
                    return fn ? <sup key={ref} className="ml-0.5 text-primary"><a href={`#fn-${ref}`} aria-label={`Footnote ${fn.symbol}`}>{fn.symbol}</a></sup> : null;
                  })}
                </span>
                {feat.tooltip && (
                  <p className="text-xs text-secondary-fg mt-0.5 opacity-80">{feat.tooltip}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // Render Limits list for a plan
  const renderLimits = (limits: PricingLimit[]) => {
    return (
      <ul className="mt-6 space-y-3 pt-6 border-t border-secondary" role="list">
        <li className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Limits</li>
        {limits.map(limit => {
          return (
            <li key={limit.id} className="flex items-center justify-between gap-4 text-sm text-secondary-fg">
              <span>
                {limit.metric}
                {limit.footnoteRefs?.map(ref => {
                  const fn = module.footnotes?.find(f => f.id === ref);
                  return fn ? <sup key={ref} className="ml-0.5 text-primary"><a href={`#fn-${ref}`} aria-label={`Footnote ${fn.symbol}`}>{fn.symbol}</a></sup> : null;
                })}
              </span>
              <span className="font-semibold text-foreground">{limit.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const getBillingPeriodText = (period?: string) => {
    if (!period) return '';
    const cycleMap: Record<string, string> = {
      month: '/mo',
      year: '/yr',
      one_time: ' once',
      custom: 'Custom'
    };
    return cycleMap[period] || period;
  };

  const renderAmount = (amount: PricingAmount) => {
    switch (amount.pricingType) {
      case 'free':
        return <span className="text-4xl md:text-5xl font-bold text-foreground">Free</span>;
      case 'contact_sales':
      case 'custom':
        return <span className="text-3xl font-bold text-foreground">{amount.label}</span>;
      case 'fixed':
      case 'starting_at':
      case 'range':
        // Just take the first price. In a real multi-currency app, you'd match the user's market.
        const price = amount.prices[0];
        const formattedMin = formatMinorAmount(price.minorAmount, price.currency, locale);
        
        let display = '';
        if (amount.pricingType === 'starting_at') {
          display = `From ${formattedMin}`;
        } else if (amount.pricingType === 'range') {
          const maxPrice = (amount as Extract<PricingAmount, { pricingType: 'range' }>).prices[0].maximumMinorAmount;
          const formattedMax = formatMinorAmount(maxPrice, price.currency, locale);
          display = `${formattedMin} - ${formattedMax}`;
        } else {
          display = formattedMin;
        }

        return (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {display}
            </span>
            {amount.billingPeriod && (
              <span className="text-secondary-fg font-medium">
                {getBillingPeriodText(amount.billingPeriod)}
              </span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-24 w-full px-6 lg:px-12 bg-background">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        {(module.heading || module.description) && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            {module.heading && (
              <h2 className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-6 text-foreground tracking-tight">
                {module.heading}
              </h2>
            )}
            {module.description && (
              <p className="text-xl text-secondary-fg leading-relaxed">
                {module.description}
              </p>
            )}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {publishablePlans.map(plan => {
            const isRecommended = !!plan.recommendation;

            return (
              <div 
                key={plan.id}
                className={`relative flex flex-col h-full rounded-2xl border transition-shadow duration-300
                  ${isRecommended 
                    ? 'border-primary shadow-xl md:-translate-y-4 md:mb-4 bg-background z-10 ring-1 ring-primary' 
                    : 'border-secondary bg-secondary/5 hover:border-secondary-fg/30'
                  }
                `}
              >
                {/* Recommended Badge */}
                {isRecommended && plan.recommendation && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                    <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                      {plan.recommendation.label}
                    </span>
                  </div>
                )}
                {!isRecommended && plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-secondary text-secondary-fg text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-md">
                      {plan.badge.text}
                    </span>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col mt-4">
                  <h3 className="text-2xl font-bold font-['Outfit'] text-foreground mb-2">
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className="text-secondary-fg text-sm mb-6 min-h-[40px]">
                      {plan.description}
                    </p>
                  )}

                  {/* Pricing Block */}
                  <div className="mb-2">
                    {renderAmount(plan.amount)}
                  </div>
                  
                  {/* Tax Display */}
                  {plan.tax && plan.tax.type !== 'not_applicable' && (
                    <div className="text-xs text-secondary-fg mb-6">
                      {plan.tax.label}
                    </div>
                  )}
                  {(!plan.tax || plan.tax.type === 'not_applicable') && (
                    <div className="mb-6"></div> // Spacer
                  )}

                  {/* CTAs */}
                  <div className="space-y-3 mb-8 mt-auto">
                    {plan.ctas.map((cta, index) => (
                      <a 
                        key={cta.id}
                        href={cta.href}
                        className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background
                          ${cta.isPrimary || (isRecommended && index === 0)
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary'
                            : 'bg-secondary text-secondary-fg hover:bg-secondary/80 focus-visible:ring-secondary'
                          }
                        `}
                      >
                        {cta.label}
                      </a>
                    ))}
                  </div>

                  {/* Features & Limits */}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground uppercase tracking-wider border-b border-secondary pb-2 mb-4">
                      Features
                    </div>
                    {renderFeatures(plan.features)}
                    {plan.limits && plan.limits.length > 0 && renderLimits(plan.limits)}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Area (Disclaimer & Footnotes) */}
        {(module.disclaimer || (module.footnotes && module.footnotes.length > 0)) && (
          <div className="mt-16 pt-8 border-t border-secondary max-w-4xl mx-auto text-sm text-secondary-fg opacity-80">
            {module.disclaimer && (
              <p className="mb-4 leading-relaxed">{module.disclaimer}</p>
            )}
            {module.footnotes && module.footnotes.length > 0 && (
              <ul className="space-y-2">
                {module.footnotes.map(fn => (
                  <li key={fn.id} id={`fn-${fn.id}`} className="flex gap-2">
                    <span className="font-semibold">{fn.symbol}</span>
                    <span>{fn.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

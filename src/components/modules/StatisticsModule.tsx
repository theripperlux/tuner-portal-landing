import React from 'react';
import { StatisticsModule as StatisticsModuleType } from '@/types/modules';
import { getPublishableStatistics } from '@/utils/statusFilter';
import { formatStatisticValue } from '@/utils/formatters';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface Props {
  module: StatisticsModuleType;
}

export function StatisticsModule({ module }: Props) {
  const publishableItems = getPublishableStatistics(module.items);

  if (!publishableItems || publishableItems.length === 0) return null;

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

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishableItems.map(item => {
          const formattedValue = formatStatisticValue(item.value, {
            locale: item.locale,
            valueType: item.valueType,
            unit: item.unit,
            precision: item.precision,
          });

          return (
            <li key={item.id} className="flex h-full">
              <Card className="flex flex-col w-full h-full p-8 border-secondary hover:border-primary/50 transition-colors">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="mb-2">
                    <span className="text-4xl font-bold font-['Outfit'] text-foreground tracking-tight">
                      {formattedValue}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.label}
                  </h3>
                  
                  {item.description && (
                    <p className="text-sm text-secondary-fg opacity-80 mb-4 flex-1">
                      {item.description}
                    </p>
                  )}

                  {item.trend && (
                    <div className="mt-auto mb-4 flex items-center gap-2 text-sm font-medium">
                      {item.trend.trendDirection === 'up' && <TrendingUp className="w-4 h-4 text-success" aria-hidden="true" />}
                      {item.trend.trendDirection === 'down' && <TrendingDown className="w-4 h-4 text-danger" aria-hidden="true" />}
                      {item.trend.trendDirection === 'neutral' && <Minus className="w-4 h-4 text-secondary-fg" aria-hidden="true" />}
                      
                      <span className={
                        item.trend.trendDirection === 'up' ? 'text-success' :
                        item.trend.trendDirection === 'down' ? 'text-danger' :
                        'text-secondary-fg'
                      }>
                        vs {item.trend.comparisonPeriod}
                      </span>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-secondary text-xs text-secondary-fg opacity-60 flex flex-wrap gap-2 justify-between items-center">
                    {item.sourceLabel ? (
                      item.sourceUrl ? (
                        <a 
                          href={item.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          Source: {item.sourceLabel}
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <span>Source: {item.sourceLabel}</span>
                      )
                    ) : null}
                    
                    {item.dataAsOf && (
                      <span className="ml-auto">As of: {new Date(item.dataAsOf).toLocaleDateString(item.locale)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

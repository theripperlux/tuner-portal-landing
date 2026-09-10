import React from 'react';
import Image from 'next/image';
import { Check, X, Minus, HelpCircle, Info } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { ComparisonTableModule as ComparisonTableModuleType, ComparisonColumn, ComparisonRow, ComparisonValue } from '@/types/modules';
import { isComparisonValuePublishable } from '@/utils/statusFilter';
import { formatStatisticValue } from '@/utils/formatters';

interface Props {
  module: ComparisonTableModuleType;
  locale?: string;
}

export function ComparisonTableModule({ module, locale = 'en' }: Props) {
  // 1. Filter Columns
  const publishableColumns = module.columns.filter(col => col.status === 'confirmed');
  
  if (publishableColumns.length === 0) return null;

  const validColIds = new Set(publishableColumns.map(col => col.id));

  // 2. Filter Rows & Values
  const now = new Date();
  const publishableRows: ComparisonRow[] = [];

  for (const row of module.rows) {
    const validValues: ComparisonValue[] = [];
    
    // O(n) loop
    for (const val of row.values) {
      if (validColIds.has(val.entityId) && isComparisonValuePublishable(val, now)) {
        validValues.push(val);
      }
    }

    if (validValues.length > 0) {
      publishableRows.push({ ...row, values: validValues });
    }
  }

  if (publishableRows.length === 0) return null;

  const renderValue = (val: ComparisonValue | undefined) => {
    if (!val) {
      // Missing value should be treated neutrally, not as negative.
      return <span className="text-secondary-fg/60 italic text-sm">Not Confirmed</span>;
    }

    switch (val.valueType) {
      case 'boolean':
        return (
          <div className="flex items-center justify-center gap-2">
            {val.value ? (
              <>
                <Check className="w-5 h-5 text-success" aria-hidden="true" />
                <span className="sr-only">Yes</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-danger" aria-hidden="true" />
                <span className="sr-only">No</span>
              </>
            )}
          </div>
        );
      
      case 'unknown':
        return (
          <div className="flex items-center justify-center gap-2 text-secondary-fg/60">
            <HelpCircle className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Unknown</span>
            <span aria-hidden="true" className="text-sm">Unknown</span>
          </div>
        );

      case 'not_applicable':
        return (
          <div className="flex items-center justify-center gap-2 text-secondary-fg/60">
            <Minus className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">Not Applicable</span>
            <span aria-hidden="true" className="text-sm">N/A</span>
          </div>
        );
      
      case 'number':
      case 'percentage':
      case 'currency':
        const formatted = formatStatisticValue(val.value, {
          locale,
          valueType: val.valueType === 'number' ? 'decimal' : val.valueType,
          unit: val.valueType === 'currency' ? 'EUR' : undefined // Basic fallback
        });
        return <span className="font-medium text-foreground">{formatted}</span>;

      case 'text':
        return <span className="text-sm text-foreground">{String(val.value)}</span>;

      case 'list':
        if (Array.isArray(val.value)) {
          return (
            <ul className="text-sm text-left list-disc pl-4 space-y-1">
              {val.value.map((item, idx) => (
                <li key={idx} className="text-foreground">{item}</li>
              ))}
            </ul>
          );
        }
        return <span className="text-sm text-foreground">{String(val.value)}</span>;

      default:
        return <span>{String(val.value)}</span>;
    }
  };

  const renderNoteAndSource = (val: ComparisonValue | undefined) => {
    if (!val) return null;
    if (!val.note && !val.sourceLabel) return null;
    
    return (
      <div className="mt-2 text-xs text-secondary-fg/70 text-left border-t border-secondary/50 pt-2">
        {val.note && <p className="mb-1">{val.note}</p>}
        {val.sourceLabel && (
          <p>
            Source:{' '}
            {val.sourceUrl ? (
              <a href={val.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                {val.sourceLabel}
              </a>
            ) : (
              <span>{val.sourceLabel}</span>
            )}
          </p>
        )}
      </div>
    );
  };

  const tableId = React.useId();
  const descId = React.useId();

  return (
    <section className="py-20 w-full max-w-[1200px] mx-auto px-6 lg:px-12">
      {(module.heading || module.description) && (
        <div className="text-center mb-12 max-w-3xl mx-auto">
          {module.heading && (
            <h2 id={tableId} className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-6 text-foreground">
              {module.heading}
            </h2>
          )}
          {module.description && (
            <p id={descId} className="text-lg text-secondary-fg opacity-80 leading-relaxed">
              {module.description}
            </p>
          )}
        </div>
      )}

      {/* Responsive Wrapper for Mobile */}
      <div 
        className="w-full overflow-x-auto rounded-xl border border-secondary shadow-sm bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background" 
        tabIndex={0} 
        role="region" 
        aria-labelledby={module.heading ? tableId : undefined}
        aria-describedby={module.description ? descId : undefined}
      >
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-secondary/20">
            <tr>
              <th scope="col" className="p-4 md:p-6 font-bold text-foreground border-b border-secondary border-r sticky left-0 bg-background/95 backdrop-blur z-10 w-[30%]">
                Features
              </th>
              {publishableColumns.map(col => (
                <th 
                  key={col.id} 
                  scope="col" 
                  className={twMerge(
                    "p-4 md:p-6 text-center border-b border-secondary align-top min-w-[200px]",
                    col.isPrimary && "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="flex flex-col items-center gap-3">
                    {col.logo ? (
                      <div className="relative w-24 h-8">
                        <Image src={col.logo} alt={col.logoAlt || col.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <span className="font-bold text-lg text-foreground font-['Outfit']">{col.name}</span>
                    )}
                    {col.description && (
                      <span className="text-xs font-normal text-secondary-fg">{col.description}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
              {publishableRows.map((row, idx) => (
                <tr key={row.id} className={twMerge(
                  "hover:bg-secondary/5 transition-colors group",
                  idx !== publishableRows.length - 1 && "border-b border-secondary"
                )}>
                  <th scope="row" className="p-4 md:p-6 text-sm font-medium text-foreground border-r border-secondary sticky left-0 bg-background/95 backdrop-blur z-10 align-top">
                    <div className="flex items-center gap-2">
                      {row.label}
                      {row.tooltip && (
                        <div className="relative group/tooltip inline-block">
                          <button type="button" className="text-secondary-fg hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-0.5" aria-label={`Information: ${row.tooltip}`}>
                            <Info className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <div className="invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 transition-all absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-foreground text-background text-xs rounded shadow-lg z-50 pointer-events-none">
                            {row.tooltip}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground"></div>
                          </div>
                        </div>
                      )}
                    </div>
                    {row.description && (
                      <p className="text-xs text-secondary-fg mt-1 font-normal leading-relaxed">{row.description}</p>
                    )}
                  </th>
                  {publishableColumns.map(col => {
                    const cellValue = row.values.find(v => v.entityId === col.id);
                    return (
                      <td 
                        key={col.id} 
                        className={twMerge(
                          "p-4 md:p-6 text-center align-top border-secondary",
                          col.isPrimary && "bg-primary/5 border-x border-primary/20"
                        )}
                      >
                        {renderValue(cellValue)}
                        {renderNoteAndSource(cellValue)}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      
      {/* Scroll Hint for small devices */}
      <div className="mt-4 text-center text-xs text-secondary-fg/60 md:hidden" aria-hidden="true">
        Swipe horizontally to see full comparison
      </div>
    </section>
  );
}

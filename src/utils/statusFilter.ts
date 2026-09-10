import { PublishStatus, ComparisonValue, PricingPlan, PricingFeature, PricingLimit, PricingCTA, PricingFootnote, ContentModule, ComparisonTableModule, PricingTableModule, LeadCaptureFormModule } from '@/types/modules';

export interface HasPublishStatus {
  status?: PublishStatus;
}

/**
 * Filtert ein Array von Items so, dass nur veröffentlichbare Items ('confirmed') zurückgegeben werden.
 * In einer Dev-Umgebung könnte dies erweitert werden, um 'needs_review' anzuzeigen, 
 * aber standardmäßig wird auf 'confirmed' gefiltert.
 * @param items Array von Objekten mit einem status-Feld
 * @returns Gefiltertes Array
 */
export function getPublishableItems<T extends HasPublishStatus>(items: T[]): T[] {
  if (!items) return [];
  return items.filter(item => item.status === 'confirmed');
}

export interface HasPublishStatusAndExpiry extends HasPublishStatus {
  expiresAt?: string; // ISO String
}

/**
 * Prüft ob eine Kennzahl veröffentlichbar ist.
 * Berücksichtigt status === 'confirmed' und dass expiresAt in der Zukunft liegt.
 */
export function isStatisticPublishable(item: HasPublishStatusAndExpiry, now: Date = new Date()): boolean {
  if (item.status !== 'confirmed') return false;
  if (item.expiresAt) {
    const expiryDate = new Date(item.expiresAt);
    if (expiryDate < now) return false;
  }
  return true;
}

export function getPublishableStatistics<T extends HasPublishStatusAndExpiry>(items: T[], now: Date = new Date()): T[] {
  if (!items) return [];
  return items.filter(item => isStatisticPublishable(item, now));
}

export interface HasConsentAndTranslation extends HasPublishStatus {
  consentConfirmed?: boolean;
  withdrawalAt?: string; // ISO String
  quote?: string;
  name?: string;
  anonymized?: boolean;
  verifiedAt?: string; // ISO String
  quoteSource?: string;
  sourceReference?: string;
  translated?: boolean;
  translationReviewed?: boolean;
}

/**
 * Prüft ob ein Testimonial veröffentlichbar ist.
 * Berücksichtigt Status, Consent, Widerruf, erforderliche Inhalte, Verifikation, Übersetzungsstatus.
 */
export function isTestimonialPublishable(item: HasConsentAndTranslation, now: Date = new Date()): boolean {
  if (item.status !== 'confirmed') return false;
  if (!item.consentConfirmed) return false;
  
  if (item.withdrawalAt) {
    const withdrawalDate = new Date(item.withdrawalAt);
    if (withdrawalDate <= now) return false;
  }

  if (!item.quote || item.quote.trim() === '') return false;
  if (!item.verifiedAt) return false;
  if (!item.quoteSource && !item.sourceReference) return false;

  if (!item.anonymized && (!item.name || item.name.trim() === '')) return false;

  if (item.translated && !item.translationReviewed) return false;

  return true;
}

export function getPublishableTestimonials<T extends HasConsentAndTranslation>(items: T[], now: Date = new Date()): T[] {
  if (!items) return [];
  return items.filter(item => isTestimonialPublishable(item, now));
}

export interface HasComparisonPublishStatus extends HasPublishStatusAndExpiry {
  sourceLabel?: string;
  sourceUrl?: string;
  verifiedAt?: string;
  internalOnly?: boolean;
}

export function isComparisonValuePublishable(value: HasComparisonPublishStatus, now: Date = new Date()): boolean {
  if (value.status !== 'confirmed') return false;
  
  if (value.expiresAt) {
    const expiryDate = new Date(value.expiresAt);
    if (expiryDate <= now) return false;
  }

  if (!value.internalOnly && !value.verifiedAt) {
    // Externe Daten benötigen zwingend ein verifiedAt
    return false;
  }

  return true;
}


/**
 * Basic publishability check for generic objects with status, expiresAt, verifiedAt, internalOnly.
 */
function isPublishable(obj: {
  status?: PublishStatus;
  expiresAt?: string;
  verifiedAt?: string;
  internalOnly?: boolean;
}, now: Date): boolean {
  if (obj.status !== 'confirmed') return false;
  if (obj.expiresAt && new Date(obj.expiresAt) < now) return false;
  
  // Only enforce verifiedAt check if the object actually has a verifiedAt field defined in its interface, 
  // or if it explicitly marks itself as internalOnly.
  // We approximate this by checking if 'verifiedAt' is a key in the object or if it's a type that requires it.
  if ('verifiedAt' in obj || 'internalOnly' in obj) {
    if (!obj.internalOnly && !obj.verifiedAt) return false;
  }
  return true;
}

/**
 * Checks if a pricing plan and its sub-elements are publishable.
 * Returns a cloned plan with unpublishable sub-elements filtered out,
 * or null if the core of the plan is not publishable.
 */
export function getPublishablePricingPlan(plan: PricingPlan, now: Date = new Date()): PricingPlan | null {
  // Check the plan itself
  if (!isPublishable(plan, now)) return null;

  // Filter features
  const publishableFeatures = plan.features.filter(f => isPublishable(f, now));
  if (publishableFeatures.length === 0) return null; // A plan must have at least one feature

  // Filter limits
  const publishableLimits = plan.limits?.filter(l => isPublishable(l, now));

  // Filter CTAs
  const publishableCtas = plan.ctas.filter(c => isPublishable(c, now));
  if (publishableCtas.length === 0) return null; // A plan must have at least one CTA

  // Check recommendation
  const recommendation = plan.recommendation && isPublishable(plan.recommendation, now) 
    ? plan.recommendation 
    : undefined;

  return {
    ...plan,
    features: publishableFeatures,
    limits: publishableLimits,
    ctas: publishableCtas,
    recommendation
  };
}

/**
 * Checks if a pricing plan and its sub-elements are publishable.
 * Returns a cloned plan with unpublishable sub-elements filtered out,
 * or null if the core of the plan is not publishable.
 */
export function getPublishablePricingTable(module: PricingTableModule, now: Date = new Date()): PricingTableModule | null {
  const publishablePlans = module.plans
    .map(plan => getPublishablePricingPlan(plan, now))
    .filter((p): p is PricingPlan => p !== null);
  
  if (publishablePlans.length === 0) return null;
  
  return {
    ...module,
    plans: publishablePlans
  };
}

export function getPublishableComparisonTable(module: ComparisonTableModule, now: Date = new Date()): ComparisonTableModule | null {
  
  const publishableColumns = module.columns.filter(c => isPublishable(c, now));
  if (publishableColumns.length === 0) return null;
  
  const colIds = new Set(publishableColumns.map(c => c.id));
  
  const publishableRows = module.rows.map(row => {
    return {
      ...row,
      values: row.values.filter(v => isPublishable(v, now) && colIds.has(v.entityId))
    };
  }).filter(row => row.values.length > 0);
  
  if (publishableRows.length === 0) return null;
  
  return {
    ...module,
    columns: publishableColumns,
    rows: publishableRows
  };
}

export function getPublishableContentModule(module: ContentModule, now: Date = new Date()): ContentModule | null {
  switch (module._type) {
    case 'hero':
      return module;
    case 'benefits':
      return module; // Items don't have status
    case 'featureGrid':
      return {
        ...module,
        items: module.items.filter(item => isPublishable(item, now))
      };
    case 'faq':
      return module; // Questions don't have status
    case 'screenshots':
      return module; // Images don't have status
    case 'statistics':
      return {
        ...module,
        items: module.items.filter(s => isPublishable(s, now))
      };
    case 'testimonials':
      return {
        ...module,
        items: module.items.filter(item => isPublishable(item, now))
      };
    case 'comparisonTable':
      return getPublishableComparisonTable(module, now);
    case 'pricingTable':
      return getPublishablePricingTable(module, now);
    case 'leadCaptureForm':
      // Currently just checks the form itself. Sub-filtering can be complex,
      // but we should at least filter sections and consents.
      return getPublishableLeadCaptureForm(module, now);
    case 'richText':
    case 'cta':
      return module; // No nested publishable sub-elements
    default:
      return module;
  }
}

function getPublishableLeadCaptureForm(module: LeadCaptureFormModule, now: Date): LeadCaptureFormModule | null {
  // Filter sections deeply
  const filterSectionContent = (content: any[]): any[] => {
    return content
      .filter(item => isPublishable(item, now))
      .map(item => {
        if ('fields' in item) {
          // It's a FormFieldGroup
          return {
            ...item,
            fields: filterSectionContent(item.fields)
          };
        }
        if ('options' in item) {
          return {
            ...item,
            options: item.options?.filter((opt: any) => isPublishable(opt, now))
          };
        }
        return item;
      });
  };

  const publishableSections = module.sections
    .filter(section => isPublishable(section, now))
    .map(section => ({
      ...section,
      content: filterSectionContent(section.content)
    }))
    .filter(section => section.content.length > 0);

  const publishableConsents = module.consents.filter(c => isPublishable(c, now));
  
  // Check if any required consent is unpublishable
  // If a required consent is needs_review, we must not publish the form at all to avoid legal risk!
  const allRequiredConsentsActive = module.consents
    .filter(c => c.required)
    .every(c => isPublishable(c, now));

  if (!allRequiredConsentsActive || publishableSections.length === 0) {
    return null;
  }

  return {
    ...module,
    sections: publishableSections,
    consents: publishableConsents,
    legalNotices: module.legalNotices?.filter(ln => isPublishable(ln, now)),
    successActions: module.successActions.filter(sa => isPublishable(sa, now))
  };
}

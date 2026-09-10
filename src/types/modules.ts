// Strongly typed content modules to build payloads dynamically

export interface HeroModule {
  _type: 'hero';
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

export interface RichTextModule {
  _type: 'richText';
  content: string; // Markdown or HTML
}

export interface BenefitsModule {
  _type: 'benefits';
  title?: string;
  items: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export type AllowedIcons = 'check' | 'star' | 'shield' | 'zap' | 'chart' | 'settings' | 'users' | 'file';
export type PublishStatus = 'confirmed' | 'needs_review' | 'hidden' | 'rejected';

export interface PublishableContent {
  status: PublishStatus;
  verifiedAt?: string;
  expiresAt?: string;
  source?: string;
  sourceUrl?: string;
  internalOnly?: boolean;
}

export interface ActionLink {
  type: 'internal' | 'external';
  href: string;
  label: string;
}

export interface FeatureGridItem {
  id: string;
  title: string;
  description: string;
  icon?: AllowedIcons;
  link?: ActionLink;
  badge?: string;
  category?: string;
  isHighlighted?: boolean;
  image?: string;
  imageAlt?: string;
  cta?: ActionLink;
  status: PublishStatus;
}

export interface FeatureGridModule {
  _type: 'featureGrid';
  heading?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  variant?: 'compact' | 'detailed' | 'with-icons' | 'with-screenshots';
  items: FeatureGridItem[];
}

export interface FAQModule {
  _type: 'faq';
  title?: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

export interface CTAModule {
  _type: 'cta';
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

export interface ScreenshotsModule {
  _type: 'screenshots';
  images: { url: string; alt: string }[];
}

export interface TrendData {
  previousValue: number;
  currentValue: number;
  comparisonPeriod: string;
  trendDirection: 'up' | 'down' | 'neutral';
  source: string;
  verifiedAt: string;
}

export interface StatisticItem {
  id: string;
  value: number;
  valueType: 'integer' | 'decimal' | 'percentage' | 'currency' | 'duration' | 'count';
  unit?: string;
  label: string;
  description?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  dataAsOf?: string;
  verifiedAt?: string;
  expiresAt?: string;
  precision?: number;
  locale: string;
  status: PublishStatus;
  trend?: TrendData;
}

export interface StatisticsModule {
  _type: 'statistics';
  heading?: string;
  description?: string;
  items: StatisticItem[];
}

export interface TestimonialItem {
  id: string;
  status: PublishStatus;
  name?: string;
  displayName?: string;
  company?: string;
  role?: string;
  quote: string;
  locale: string;
  consentConfirmed: boolean;
  consentConfirmedAt?: string;
  consentScope?: string;
  consentVersion?: string;
  consentReference?: string;
  withdrawalAt?: string;
  verifiedAt?: string;
  quoteSource?: string;
  sourceReference?: string;
  image?: string;
  imageAlt?: string;
  logo?: string;
  logoAlt?: string;
  caseStudyId?: string;
  caseStudyLink?: string;
  anonymized?: boolean;
  featured?: boolean;
  order?: number;
  originalLocale?: string;
  displayLocale?: string;
  translated?: boolean;
  translationReviewed?: boolean;
  originalQuote?: string;
}

export interface TestimonialsModule {
  _type: 'testimonials';
  heading?: string;
  description?: string;
  variant?: 'single' | 'grid' | 'featured' | 'logo-quote' | 'case-study-teaser' | 'horizontal-scroll';
  items: TestimonialItem[];
  cta?: ActionLink;
}

export interface ComparisonColumn {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  logoAlt?: string;
  description?: string;
  website?: string;
  isPrimary?: boolean;
  status: PublishStatus;
}

export interface ComparisonValue {
  entityId: string;
  value: any; // Der konkrete Wert, z.B. boolean, string, number, array
  valueType: 'boolean' | 'text' | 'number' | 'percentage' | 'currency' | 'list' | 'unknown' | 'not_applicable';
  status: PublishStatus;
  sourceLabel?: string;
  sourceUrl?: string;
  verifiedAt?: string;
  expiresAt?: string;
  note?: string;
  internalOnly?: boolean;
}

export interface ComparisonRow {
  id: string;
  label: string;
  description?: string;
  tooltip?: string;
  category?: string;
  order?: number;
  values: ComparisonValue[];
}

export interface ComparisonTableModule {
  _type: 'comparisonTable';
  heading?: string;
  description?: string;
  variant?: 'compact' | 'detailed' | 'pricing' | 'competitor' | 'before-after' | 'mobile-cards';
  comparisonType?: 'pricing' | 'features' | 'plans' | 'alternatives' | 'workflow' | 'migration' | 'before_after';
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
}

export interface PricingLimit {
  id: string;
  metric: string;
  value: number | string;
  limitType: 'hard' | 'soft' | 'fair_use';
  status: PublishStatus;
  footnoteRefs?: string[];
}

export interface PricingFeature {
  id: string;
  label: string;
  tooltip?: string;
  included: boolean | string;
  status: PublishStatus;
  footnoteRefs?: string[];
}

export interface PricingBadge {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export interface PricingCTA {
  id: string;
  label: string;
  href: string;
  isPrimary?: boolean;
  status: PublishStatus;
}

export interface PricingFootnote {
  id: string;
  scope: 'referenced' | 'module';
  symbol: string;
  text: string;
}

export type BillingPeriod = "one_time" | "month" | "year" | "custom";

export type LocalizedPrice = {
  currency: string;
  minorAmount: number;
  markets?: readonly string[];
  locales?: readonly string[];
};

export type PricingAmount =
  | { pricingType: "free" }
  | { pricingType: "fixed"; prices: LocalizedPrice[]; billingPeriod: BillingPeriod }
  | { pricingType: "starting_at"; prices: LocalizedPrice[]; billingPeriod?: BillingPeriod }
  | { pricingType: "range"; prices: (LocalizedPrice & { maximumMinorAmount: number })[]; billingPeriod?: BillingPeriod }
  | { pricingType: "custom"; label: string }
  | { pricingType: "contact_sales"; label: string };

export type TaxDisplay =
  | { type: "included"; label: string }
  | { type: "excluded"; label: string }
  | { type: "not_applicable" }
  | { type: "unknown"; label: string };

export interface PricingRecommendation {
  status: PublishStatus;
  label: string;
  reason?: string;
  verifiedAt?: string;
  expiresAt?: string;
  source?: string;
  sourceUrl?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  badge?: PricingBadge;
  amount: PricingAmount;
  tax?: TaxDisplay;
  features: PricingFeature[];
  limits?: PricingLimit[];
  ctas: PricingCTA[];
  recommendation?: PricingRecommendation;
  status: PublishStatus;
  sourceLabel?: string;
  sourceUrl?: string;
  verifiedAt?: string;
  expiresAt?: string;
  internalOnly?: boolean;
}

export interface PricingTableModule {
  _type: 'pricingTable';
  heading?: string;
  description?: string;
  variant?: 'cards' | 'comparison' | 'compact' | 'enterprise' | 'feature-first';
  plans: PricingPlan[];
  disclaimer?: string;
  footnotes?: PricingFootnote[];
}

export interface FieldCondition {
  dependsOnId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;
}

export interface FormFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  customValidatorId?: string;
  errorMessageOverrides?: Record<string, string>;
}

export interface FormOption extends PublishableContent {
  id: string;
  value: string;
  label: string;
  isDefault?: boolean;
}

export interface BaseFormField extends PublishableContent {
  id: string;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  validation?: FormFieldValidation;
  conditions?: FieldCondition[];
}

export type FormField =
  | (BaseFormField & { type: 'text' })
  | (BaseFormField & { type: 'textarea'; rows?: number })
  | (BaseFormField & { type: 'email' })
  | (BaseFormField & { type: 'tel'; defaultCountryCode?: string })
  | (BaseFormField & { type: 'url' })
  | (BaseFormField & { type: 'number'; step?: number })
  | (BaseFormField & { type: 'select'; options: FormOption[]; multiple?: boolean })
  | (BaseFormField & { type: 'multiselect'; options: FormOption[]; minSelection?: number; maxSelection?: number })
  | (BaseFormField & { type: 'checkbox'; textLabel: string })
  | (BaseFormField & { type: 'radio'; options: FormOption[] })
  | (BaseFormField & { type: 'switch'; onLabel?: string; offLabel?: string })
  | (BaseFormField & { type: 'country'; allowedCountries?: string[] })
  | (BaseFormField & { type: 'language'; allowedLanguages?: string[] })
  | (BaseFormField & { type: 'timezone' })
  | (BaseFormField & { type: 'date'; minDate?: string; maxDate?: string })
  | (BaseFormField & { type: 'datetime'; minDate?: string; maxDate?: string })
  | (BaseFormField & { type: 'company' })
  | (BaseFormField & { type: 'vat'; validateVies?: boolean })
  | (BaseFormField & { type: 'password' })
  | (BaseFormField & { type: 'hidden'; defaultValue: string });

export interface FormFieldGroup extends PublishableContent {
  id: string;
  heading?: string;
  description?: string;
  layout: 'vertical' | 'horizontal' | 'grid-2' | 'grid-3';
  fields: (FormField | FormFieldGroup)[];
}

export interface FormSection extends PublishableContent {
  id: string;
  stepTitle?: string;
  stepDescription?: string;
  content: (FormField | FormFieldGroup)[];
}

export type SuccessAction = PublishableContent & (
  | { type: 'message'; heading: string; text: string }
  | { type: 'redirect'; url: string; delayMs?: number }
  | { type: 'download'; fileUrl: string; fileName?: string }
  | { type: 'calendar'; schedulingUrl: string }
  | { type: 'webhook'; targetId: string; payloadMapping?: Record<string, string> }
  | { type: 'crm_event'; eventName: string; pipelineId?: string }
  | { type: 'email_confirmation'; templateId: string }
);

export type ConsentType = 'dsgvo' | 'marketing' | 'newsletter' | 'tracking' | 'third_party' | 'profiling';

export interface Consent extends PublishableContent {
  id: string;
  type: ConsentType;
  version: string;
  required: boolean;
  documentReferenceUrl?: string;
  text: string;
}

export interface LegalNotice extends PublishableContent {
  id: string;
  text: string;
}

export interface LeadCaptureFormModule {
  _type: 'leadCaptureForm';
  id: string;
  heading?: string;
  description?: string;
  sections: FormSection[];
  consents: Consent[];
  legalNotices?: LegalNotice[];
  successActions: SuccessAction[];
  errorMessages: {
    generalError: string;
    networkError: string;
    validationError: string;
    rateLimitError: string;
  };
  submitLabel: string;
  loadingLabel?: string;
  securityConfig?: {
    requireHoneypot?: boolean;
    requireCaptcha?: boolean;
    rateLimitKey?: string;
  };
}

export type ContentModule = 
  | HeroModule 
  | RichTextModule 
  | BenefitsModule 
  | FeatureGridModule 
  | FAQModule 
  | CTAModule
  | ScreenshotsModule
  | StatisticsModule
  | TestimonialsModule
  | ComparisonTableModule
  | PricingTableModule
  | LeadCaptureFormModule;

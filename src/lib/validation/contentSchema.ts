import { z } from 'zod';
import { ContentType, SchemaType } from '@/types/content';

const seoSchema = z.object({
  metaTitle: z.string().min(10, 'Meta title must be at least 10 characters'),
  metaDescription: z.string().min(50, 'Meta description must be at least 50 characters'),
  focusKeyword: z.string().optional(),
  secondaryKeywords: z.array(z.string()).optional(),
  canonicalOverride: z.string().url().optional(),
  robots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  ogType: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url().optional(),
  schemaTypes: z.array(z.enum(['SoftwareApplication', 'Article', 'FAQPage', 'Product', 'WebPage', 'TechArticle', 'HowTo', 'Review', 'VideoObject', 'BreadcrumbList', 'Organization'])).min(1, 'At least one schema type required'),
  structuredDataOverrides: z.record(z.string(), z.any()).optional(),
  searchIntent: z.enum(['informational', 'transactional', 'commercial', 'navigational']),
  difficulty: z.number().min(0).max(100).optional(),
  priority: z.number().min(0).max(1).optional()
});

const aiSchema = z.object({
  aiSummary: z.string().optional(),
  aiQuestions: z.array(z.string()).optional(),
  aiAnswers: z.array(z.string()).optional(),
  vectorId: z.string().optional(),
  embeddingStatus: z.enum(['pending', 'completed', 'failed']).optional(),
  embeddingModel: z.string().optional(),
  embeddedAt: z.string().datetime().optional(),
  llmMetadata: z.record(z.string(), z.any()).optional()
});

const relationSchema = z.object({
  targetId: z.string(),
  relationType: z.enum(['related', 'recommended', 'parent', 'child', 'supports', 'integrates_with', 'alternative_to', 'mentioned_in']),
  weight: z.number().optional(),
  manual: z.boolean().optional()
});

const baseContentSchema = z.object({
  id: z.string(),
  type: z.enum(['feature', 'solution', 'integration', 'comparison', 'industry', 'tutorial', 'glossary', 'blog', 'case_study', 'documentation', 'api_documentation', 'academy', 'knowledge_base', 'template', 'changelog', 'landing_page', 'legal_page']),
  slug: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens.')
    .regex(/^(?!-).*$/, 'Slug cannot start with a hyphen.')
    .regex(/.*(?<!-)$/, 'Slug cannot end with a hyphen.')
    .regex(/^(?!.*--).*$/, 'Slug cannot contain double hyphens.')
    .refine(val => !['api', 'admin', 'login', 'register', 'dashboard', 'features', 'funktionen'].includes(val), {
      message: 'Reserved slug name'
    }),
  locale: z.string(),
  translationGroupId: z.string(),
  status: z.enum(['draft', 'review', 'scheduled', 'published', 'archived']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().optional(),
  authorId: z.string().optional(),
  version: z.number().int().positive(),
  parentId: z.string().optional(),
  order: z.number().int().optional(),
  tags: z.array(z.string()),
  categories: z.array(z.string()),
  featuredImage: z.string().url().optional(),
  noIndex: z.boolean(),
  excludeFromSitemap: z.boolean(),
  title: z.string().min(5),
  seo: seoSchema,
  ai: aiSchema,
  relations: z.array(relationSchema)
});

const heroModuleSchema = z.object({
  _type: z.literal('hero'),
  title: z.string(),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  image: z.string().optional(),
});

const richTextModuleSchema = z.object({
  _type: z.literal('richText'),
  content: z.string()
});

const benefitsModuleSchema = z.object({
  _type: z.literal('benefits'),
  title: z.string().optional(),
  items: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  }))
});

const actionLinkSchema = z.object({
  type: z.enum(['internal', 'external']),
  href: z.string(),
  label: z.string()
});

const featureGridItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.enum(['check', 'star', 'shield', 'zap', 'chart', 'settings', 'users', 'file']).optional(),
  link: actionLinkSchema.optional(),
  badge: z.string().optional(),
  category: z.string().optional(),
  isHighlighted: z.boolean().optional(),
  image: z.string().url().optional(),
  imageAlt: z.string().optional(),
  cta: actionLinkSchema.optional(),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected'])
});

const featureGridModuleSchema = z.object({
  _type: z.literal('featureGrid'),
  heading: z.string().optional(),
  description: z.string().optional(),
  columns: z.enum(['2', '3', '4']).transform(Number).or(z.number().min(2).max(4)).optional(),
  variant: z.enum(['compact', 'detailed', 'with-icons', 'with-screenshots']).optional(),
  items: z.array(featureGridItemSchema)
});

const faqModuleSchema = z.object({
  _type: z.literal('faq'),
  title: z.string().optional(),
  questions: z.array(z.object({
    question: z.string(),
    answer: z.string()
  }))
});

const ctaModuleSchema = z.object({
  _type: z.literal('cta'),
  title: z.string(),
  subtitle: z.string().optional(),
  buttonText: z.string(),
  buttonLink: z.string()
});

const screenshotsModuleSchema = z.object({
  _type: z.literal('screenshots'),
  images: z.array(z.object({ url: z.string(), alt: z.string() }))
});

const trendDataSchema = z.object({
  previousValue: z.number(),
  currentValue: z.number(),
  comparisonPeriod: z.string(),
  trendDirection: z.enum(['up', 'down', 'neutral']),
  source: z.string(),
  verifiedAt: z.string().datetime()
});

const statisticItemSchema = z.object({
  id: z.string(),
  value: z.number(),
  valueType: z.enum(['integer', 'decimal', 'percentage', 'currency', 'duration', 'count']),
  unit: z.string().optional(),
  label: z.string(),
  description: z.string().optional(),
  sourceLabel: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  dataAsOf: z.string().datetime().optional(),
  verifiedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  precision: z.number().optional(),
  locale: z.string(),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  trend: trendDataSchema.optional()
}).refine(data => {
  // Quelle ist bei confirmed pflicht
  if (data.status === 'confirmed') {
    return !!(data.sourceLabel || data.sourceUrl);
  }
  return true;
}, {
  message: "Source is required for confirmed statistics",
  path: ["status"]
});

const statisticsModuleSchema = z.object({
  _type: z.literal('statistics'),
  heading: z.string().optional(),
  description: z.string().optional(),
  items: z.array(statisticItemSchema)
});

const testimonialItemSchema = z.object({
  id: z.string(),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  name: z.string().optional(),
  displayName: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  quote: z.string(),
  locale: z.string(),
  consentConfirmed: z.boolean(),
  consentConfirmedAt: z.string().datetime().optional(),
  consentScope: z.string().optional(),
  consentVersion: z.string().optional(),
  consentReference: z.string().optional(),
  withdrawalAt: z.string().datetime().optional(),
  verifiedAt: z.string().datetime().optional(),
  quoteSource: z.string().optional(),
  sourceReference: z.string().optional(),
  image: z.string().url().optional(),
  imageAlt: z.string().optional(),
  logo: z.string().url().optional(),
  logoAlt: z.string().optional(),
  caseStudyId: z.string().optional(),
  caseStudyLink: z.string().optional(),
  anonymized: z.boolean().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  originalLocale: z.string().optional(),
  displayLocale: z.string().optional(),
  translated: z.boolean().optional(),
  translationReviewed: z.boolean().optional(),
  originalQuote: z.string().optional(),
});

const testimonialsModuleSchema = z.object({
  _type: z.literal('testimonials'),
  heading: z.string().optional(),
  description: z.string().optional(),
  variant: z.enum(['single', 'grid', 'featured', 'logo-quote', 'case-study-teaser', 'horizontal-scroll']).optional(),
  items: z.array(testimonialItemSchema),
  cta: actionLinkSchema.optional()
});

const comparisonColumnSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  logo: z.string().url().optional(),
  logoAlt: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  isPrimary: z.boolean().optional(),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected'])
});

const comparisonValueSchema = z.object({
  entityId: z.string(),
  value: z.any(),
  valueType: z.enum(['boolean', 'text', 'number', 'percentage', 'currency', 'list', 'unknown', 'not_applicable']),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  sourceLabel: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  verifiedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  note: z.string().optional(),
  internalOnly: z.boolean().optional(),
}).refine(data => {
  if (data.status === 'confirmed' && !data.internalOnly) {
    // Ohne verifiedAt kein confirmed für Werte
    return !!data.verifiedAt;
  }
  return true;
}, {
  message: "verifiedAt is required for confirmed external comparison values",
  path: ["status"]
});

const comparisonRowSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  tooltip: z.string().optional(),
  category: z.string().optional(),
  order: z.number().optional(),
  values: z.array(comparisonValueSchema)
});


// === Lead Capture Form Schemas ===

const publishableContentSchema = z.object({
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  verifiedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  internalOnly: z.boolean().optional()
});

const fieldConditionSchema = z.object({
  dependsOnId: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'is_empty', 'is_not_empty']),
  value: z.any().optional()
});

const formFieldValidationSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  regex: z.string().optional(),
  customValidatorId: z.string().optional(),
  errorMessageOverrides: z.record(z.string(), z.string()).optional()
});

const formOptionSchema = publishableContentSchema.extend({
  id: z.string(),
  value: z.string(),
  label: z.string(),
  isDefault: z.boolean().optional()
});

const baseFormFieldSchema = publishableContentSchema.extend({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  validation: formFieldValidationSchema.optional(),
  conditions: z.array(fieldConditionSchema).optional()
});

export const formFieldSchema = z.discriminatedUnion('type', [
  baseFormFieldSchema.extend({ type: z.literal('text') }),
  baseFormFieldSchema.extend({ type: z.literal('textarea'), rows: z.number().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('email') }),
  baseFormFieldSchema.extend({ type: z.literal('tel'), defaultCountryCode: z.string().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('url') }),
  baseFormFieldSchema.extend({ type: z.literal('number'), step: z.number().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('select'), options: z.array(formOptionSchema), multiple: z.boolean().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('multiselect'), options: z.array(formOptionSchema), minSelection: z.number().optional(), maxSelection: z.number().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('checkbox'), textLabel: z.string() }),
  baseFormFieldSchema.extend({ type: z.literal('radio'), options: z.array(formOptionSchema) }),
  baseFormFieldSchema.extend({ type: z.literal('switch'), onLabel: z.string().optional(), offLabel: z.string().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('country'), allowedCountries: z.array(z.string()).optional() }),
  baseFormFieldSchema.extend({ type: z.literal('language'), allowedLanguages: z.array(z.string()).optional() }),
  baseFormFieldSchema.extend({ type: z.literal('timezone') }),
  baseFormFieldSchema.extend({ type: z.literal('date'), minDate: z.string().optional(), maxDate: z.string().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('datetime'), minDate: z.string().optional(), maxDate: z.string().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('company') }),
  baseFormFieldSchema.extend({ type: z.literal('vat'), validateVies: z.boolean().optional() }),
  baseFormFieldSchema.extend({ type: z.literal('password') }),
  baseFormFieldSchema.extend({ type: z.literal('hidden'), defaultValue: z.string() })
]);

export type FormFieldType = z.infer<typeof formFieldSchema>;

// Recursive schema for form groups
export const formFieldGroupSchema: z.ZodType<any> = z.lazy(() => publishableContentSchema.extend({
  id: z.string(),
  heading: z.string().optional(),
  description: z.string().optional(),
  layout: z.enum(['vertical', 'horizontal', 'grid-2', 'grid-3']),
  fields: z.array(z.union([formFieldSchema, formFieldGroupSchema]))
}));

export const formSectionSchema = publishableContentSchema.extend({
  id: z.string(),
  stepTitle: z.string().optional(),
  stepDescription: z.string().optional(),
  content: z.array(z.union([formFieldSchema, formFieldGroupSchema]))
});

export const successActionSchema = z.discriminatedUnion('type', [
  publishableContentSchema.extend({ type: z.literal('message'), heading: z.string(), text: z.string() }),
  publishableContentSchema.extend({ type: z.literal('redirect'), url: z.string(), delayMs: z.number().optional() }),
  publishableContentSchema.extend({ type: z.literal('download'), fileUrl: z.string(), fileName: z.string().optional() }),
  publishableContentSchema.extend({ type: z.literal('calendar'), schedulingUrl: z.string() }),
  publishableContentSchema.extend({ type: z.literal('webhook'), targetId: z.string(), payloadMapping: z.record(z.string(), z.string()).optional() }),
  publishableContentSchema.extend({ type: z.literal('crm_event'), eventName: z.string(), pipelineId: z.string().optional() }),
  publishableContentSchema.extend({ type: z.literal('email_confirmation'), templateId: z.string() })
]);

export const consentSchema = publishableContentSchema.extend({
  id: z.string(),
  type: z.enum(['dsgvo', 'marketing', 'newsletter', 'tracking', 'third_party', 'profiling']),
  version: z.string(),
  required: z.boolean(),
  documentReferenceUrl: z.string().url().optional(),
  text: z.string()
});

export const legalNoticeSchema = publishableContentSchema.extend({
  id: z.string(),
  text: z.string()
});

export const leadCaptureFormModuleSchema = z.object({
  _type: z.literal('leadCaptureForm'),
  id: z.string(),
  heading: z.string().optional(),
  description: z.string().optional(),
  sections: z.array(formSectionSchema),
  consents: z.array(consentSchema),
  legalNotices: z.array(legalNoticeSchema).optional(),
  successActions: z.array(successActionSchema),
  errorMessages: z.object({
    generalError: z.string(),
    networkError: z.string(),
    validationError: z.string(),
    rateLimitError: z.string()
  }),
  submitLabel: z.string(),
  loadingLabel: z.string().optional(),
  securityConfig: z.object({
    requireHoneypot: z.boolean().optional(),
    requireCaptcha: z.boolean().optional(),
    rateLimitKey: z.string().optional()
  }).optional()
}).superRefine((data, ctx) => {
  // Cross-validation for LeadCaptureForm
  const allFieldIds = new Set<string>();
  const allFieldNames = new Set<string>();

  const traverseFields = (items: any[]) => {
    for (const item of items) {
      if (item.id) {
        if (allFieldIds.has(item.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate field or group id: ${item.id}`,
            path: ['sections', '...'] // generic path for deeply nested
          });
        }
        allFieldIds.add(item.id);
      }
      
      // If it's a field (has a name)
      if (item.name) {
        if (allFieldNames.has(item.name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate field name: ${item.name}`,
            path: ['sections', '...']
          });
        }
        allFieldNames.add(item.name);
      }

      // Recursion
      if (item.fields) traverseFields(item.fields);
    }
  };

  data.sections.forEach(section => {
    traverseFields(section.content);
  });

  // Verify conditions reference existing fields
  const traverseConditions = (items: any[]) => {
    for (const item of items) {
      if (item.conditions) {
        item.conditions.forEach((cond: any) => {
          if (!allFieldIds.has(cond.dependsOnId)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Condition references unknown field id: ${cond.dependsOnId}`,
              path: ['sections', '...']
            });
          }
        });
      }
      if (item.fields) traverseConditions(item.fields);
    }
  };

  data.sections.forEach(section => {
    traverseConditions(section.content);
  });
});

const comparisonTableModuleSchema = z.object({
  _type: z.literal('comparisonTable'),
  heading: z.string().optional(),
  description: z.string().optional(),
  variant: z.enum(['compact', 'detailed', 'pricing', 'competitor', 'before-after', 'mobile-cards']).optional(),
  comparisonType: z.enum(['pricing', 'features', 'plans', 'alternatives', 'workflow', 'migration', 'before_after']).optional(),
  columns: z.array(comparisonColumnSchema).min(1, "At least one column is required"),
  rows: z.array(comparisonRowSchema).min(1, "At least one row is required")
}).superRefine((data, ctx) => {
  // Check duplicate column ids
  const colIds = new Set<string>();
  for (let i = 0; i < data.columns.length; i++) {
    const col = data.columns[i];
    if (colIds.has(col.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate column id: ${col.id}`,
        path: ['columns', i, 'id']
      });
    }
    colIds.add(col.id);
  }

  // Check duplicate row ids and value mismatches
  const rowIds = new Set<string>();
  for (let i = 0; i < data.rows.length; i++) {
    const row = data.rows[i];
    
    if (rowIds.has(row.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate row id: ${row.id}`,
        path: ['rows', i, 'id']
      });
    }
    rowIds.add(row.id);

    // Check if each row has exactly the right values
    if (row.values.length !== colIds.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Row must have exactly ${colIds.size} values to match columns`,
        path: ['rows', i, 'values']
      });
    }

    const valEntityIds = new Set<string>();
    for (let j = 0; j < row.values.length; j++) {
      const val = row.values[j];
      if (!colIds.has(val.entityId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown entityId reference: ${val.entityId}`,
          path: ['rows', i, 'values', j, 'entityId']
        });
      }
      if (valEntityIds.has(val.entityId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate entityId in row: ${val.entityId}`,
          path: ['rows', i, 'values', j, 'entityId']
        });
      }
      valEntityIds.add(val.entityId);
    }
  }
});

const pricingLimitSchema = z.object({
  id: z.string(),
  metric: z.string(),
  value: z.union([z.number(), z.string()]),
  limitType: z.enum(['hard', 'soft', 'fair_use']),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  footnoteRefs: z.array(z.string()).optional()
});

const pricingFeatureSchema = z.object({
  id: z.string(),
  label: z.string(),
  tooltip: z.string().optional(),
  included: z.union([z.boolean(), z.string()]),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  footnoteRefs: z.array(z.string()).optional()
});

const pricingBadgeSchema = z.object({
  text: z.string(),
  variant: z.enum(['primary', 'secondary', 'success', 'warning']).optional()
});

const pricingCTASchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  href: z.string().refine(v => !v.toLowerCase().startsWith('javascript:'), { message: 'No javascript: URIs allowed' }),
  isPrimary: z.boolean().optional(),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected'])
});

const pricingFootnoteSchema = z.object({
  id: z.string(),
  scope: z.enum(['referenced', 'module']),
  symbol: z.string(),
  text: z.string()
});

const localizedPriceSchema = z.object({
  currency: z.string().length(3),
  minorAmount: z.number().int().nonnegative(),
  markets: z.array(z.string()).optional(),
  locales: z.array(z.string()).optional()
});

const pricingAmountSchema = z.discriminatedUnion('pricingType', [
  z.object({ pricingType: z.literal('free') }),
  z.object({
    pricingType: z.literal('fixed'),
    prices: z.array(localizedPriceSchema).min(1),
    billingPeriod: z.enum(['one_time', 'month', 'year', 'custom'])
  }),
  z.object({
    pricingType: z.literal('starting_at'),
    prices: z.array(localizedPriceSchema).min(1),
    billingPeriod: z.enum(['one_time', 'month', 'year', 'custom']).optional()
  }),
  z.object({
    pricingType: z.literal('range'),
    prices: z.array(localizedPriceSchema.extend({
      maximumMinorAmount: z.number().int().nonnegative()
    })).min(1).superRefine((prices, ctx) => {
      prices.forEach((p, idx) => {
        if (p.minorAmount >= p.maximumMinorAmount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'minorAmount must be less than maximumMinorAmount (use fixed instead)',
            path: [idx, 'maximumMinorAmount']
          });
        }
      });
    }),
    billingPeriod: z.enum(['one_time', 'month', 'year', 'custom']).optional()
  }),
  z.object({ pricingType: z.literal('custom'), label: z.string() }),
  z.object({ pricingType: z.literal('contact_sales'), label: z.string() })
]);

const taxDisplaySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('included'), label: z.string() }),
  z.object({ type: z.literal('excluded'), label: z.string() }),
  z.object({ type: z.literal('not_applicable') }),
  z.object({ type: z.literal('unknown'), label: z.string() })
]);

const pricingRecommendationSchema = z.object({
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  label: z.string(),
  reason: z.string().optional(),
  verifiedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional()
});

const pricingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  badge: pricingBadgeSchema.optional(),
  amount: pricingAmountSchema,
  tax: taxDisplaySchema.optional(),
  features: z.array(pricingFeatureSchema).min(1, "At least one feature is required"),
  limits: z.array(pricingLimitSchema).optional(),
  ctas: z.array(pricingCTASchema),
  recommendation: pricingRecommendationSchema.optional(),
  status: z.enum(['confirmed', 'needs_review', 'hidden', 'rejected']),
  sourceLabel: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  verifiedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  internalOnly: z.boolean().optional()
}).refine(data => {
  if (data.status === 'confirmed' && !data.internalOnly) {
    return !!data.verifiedAt;
  }
  return true;
}, {
  message: "verifiedAt is required for confirmed external plans",
  path: ["status"]
}).refine(data => {
  if (data.expiresAt && data.verifiedAt) {
    return new Date(data.expiresAt) >= new Date(data.verifiedAt);
  }
  return true;
}, {
  message: "expiresAt cannot be before verifiedAt",
  path: ["expiresAt"]
});

export const pricingTableModuleSchema = z.object({
  _type: z.literal('pricingTable'),
  heading: z.string().optional(),
  description: z.string().optional(),
  variant: z.enum(['cards', 'comparison', 'compact', 'enterprise', 'feature-first']).optional(),
  plans: z.array(pricingPlanSchema).min(1, "At least one plan is required"),
  disclaimer: z.string().optional(),
  footnotes: z.array(pricingFootnoteSchema).optional()
}).superRefine((data, ctx) => {
  const planIds = new Set<string>();
  const footnoteIds = new Set<string>(data.footnotes?.map(f => f.id) || []);
  const referencedFootnoteIds = new Set<string>();
  
  if (data.footnotes) {
    const fnIds = new Set<string>();
    for (let i = 0; i < data.footnotes.length; i++) {
      const fId = data.footnotes[i].id;
      if (fnIds.has(fId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate footnote id: ${fId}`,
          path: ['footnotes', i, 'id']
        });
      }
      fnIds.add(fId);
    }
  }

  for (let i = 0; i < data.plans.length; i++) {
    const plan = data.plans[i];
    if (planIds.has(plan.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate plan id: ${plan.id}`,
        path: ['plans', i, 'id']
      });
    }
    planIds.add(plan.id);

    const featureIds = new Set<string>();
    for (let j = 0; j < plan.features.length; j++) {
      const featId = plan.features[j].id;
      if (featureIds.has(featId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate feature id: ${featId}`,
          path: ['plans', i, 'features', j, 'id']
        });
      }
      featureIds.add(featId);
      
      const refs = plan.features[j].footnoteRefs;
      if (refs) {
        const uniqueRefs = new Set<string>();
        for (let k = 0; k < refs.length; k++) {
          if (uniqueRefs.has(refs[k])) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Duplicate footnoteRef in same feature: ${refs[k]}`,
              path: ['plans', i, 'features', j, 'footnoteRefs', k]
            });
          }
          uniqueRefs.add(refs[k]);
          referencedFootnoteIds.add(refs[k]);

          if (!footnoteIds.has(refs[k])) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Unknown footnoteRef: ${refs[k]}`,
              path: ['plans', i, 'features', j, 'footnoteRefs', k]
            });
          }
        }
      }
    }
    
    if (plan.limits) {
      const limitIds = new Set<string>();
      for (let j = 0; j < plan.limits.length; j++) {
        const lId = plan.limits[j].id;
        if (limitIds.has(lId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate limit id: ${lId}`,
            path: ['plans', i, 'limits', j, 'id']
          });
        }
        limitIds.add(lId);
        
        const refs = plan.limits[j].footnoteRefs;
        if (refs) {
          const uniqueRefs = new Set<string>();
          for (let k = 0; k < refs.length; k++) {
            if (uniqueRefs.has(refs[k])) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Duplicate footnoteRef in same limit: ${refs[k]}`,
                path: ['plans', i, 'limits', j, 'footnoteRefs', k]
              });
            }
            uniqueRefs.add(refs[k]);
            referencedFootnoteIds.add(refs[k]);

            if (!footnoteIds.has(refs[k])) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Unknown footnoteRef: ${refs[k]}`,
                path: ['plans', i, 'limits', j, 'footnoteRefs', k]
              });
            }
          }
        }
      }
    }
    
    const ctaIds = new Set<string>();
    for (let j = 0; j < plan.ctas.length; j++) {
      const cId = plan.ctas[j].id;
      if (ctaIds.has(cId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate CTA id: ${cId}`,
          path: ['plans', i, 'ctas', j, 'id']
        });
      }
      ctaIds.add(cId);
    }
  }

  // Ensure scoped footnotes are referenced
  if (data.footnotes) {
    for (let i = 0; i < data.footnotes.length; i++) {
      const fn = data.footnotes[i];
      if (fn.scope === 'referenced' && !referencedFootnoteIds.has(fn.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Footnote '${fn.id}' has scope 'referenced' but is never referenced`,
          path: ['footnotes', i, 'id']
        });
      }
    }
  }
});

export const contentModuleSchema = z.discriminatedUnion('_type', [
  heroModuleSchema,
  richTextModuleSchema,
  benefitsModuleSchema,
  featureGridModuleSchema,
  faqModuleSchema,
  ctaModuleSchema,
  screenshotsModuleSchema,
  statisticsModuleSchema,
  testimonialsModuleSchema,
  comparisonTableModuleSchema,
  pricingTableModuleSchema,
  leadCaptureFormModuleSchema
]);

const featureContentSchema = baseContentSchema.extend({
  type: z.literal('feature'),
  payload: z.object({
    modules: z.array(contentModuleSchema).min(1, 'Feature must have at least one module')
  })
});

const solutionContentSchema = baseContentSchema.extend({
  type: z.literal('solution'),
  payload: z.object({
    modules: z.array(contentModuleSchema).min(1, 'Solution must have at least one module')
  })
});

export const universalContentSchema = z.discriminatedUnion('type', [
  featureContentSchema,
  solutionContentSchema
  // other types to be added
]);

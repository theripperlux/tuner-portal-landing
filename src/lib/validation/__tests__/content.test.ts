import { describe, it, expect, vi } from 'vitest';

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    getPathname: ({ href, locale }: any) => {
      let path = href.pathname || href;
      if (href.params?.slug) {
        if (locale === 'de' && path === '/features/[slug]') {
          return `/de/funktionen/${href.params.slug}`;
        }
        return `/${locale}${path.replace('[slug]', href.params.slug)}`;
      }
      return `/${locale}${path}`;
    }
  })
}));

import { getLocalizedContentPath, getTranslationAlternates } from '@/i18n/routing';
import { isContentPublic } from '@/utils/contentUtils';
import { UniversalContent } from '@/types/content';
import { universalContentSchema, contentModuleSchema } from '../contentSchema';
import { validateContentDatabase } from '../contentValidator';

const nowStr = new Date().toISOString();

describe('Content Engine Rules', () => {
  const dummyEn: UniversalContent = {
    id: 'feat_1_en',
    type: 'feature',
    slug: 'my-feature',
    locale: 'en',
    translationGroupId: 'feat_1',
    status: 'published',
    createdAt: nowStr,
    updatedAt: nowStr,
    version: 1,
    tags: [],
    categories: [],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'My Feature',
    seo: {
      metaTitle: 'This is a valid meta title that is long enough',
      metaDescription: 'This is a valid meta description that is definitely long enough to pass the fifty character minimum requirement for the zod schema.',
      searchIntent: 'informational',
      schemaTypes: ['WebPage']
    },
    ai: {},
    relations: [],
    payload: { modules: [{ _type: 'hero', title: 'Test Hero', subtitle: 'Test Subtitle' }] }
  };

  const dummyDe: UniversalContent = {
    ...dummyEn,
    id: 'feat_1_de',
    slug: 'mein-feature',
    locale: 'de',
    title: 'Mein Feature',
  };

  describe('isContentPublic', () => {
    it('returns true for published content', () => {
      expect(isContentPublic(dummyEn)).toBe(true);
    });

    it('returns false for draft, review, archived', () => {
      expect(isContentPublic({ ...dummyEn, status: 'draft' })).toBe(false);
      expect(isContentPublic({ ...dummyEn, status: 'review' })).toBe(false);
      expect(isContentPublic({ ...dummyEn, status: 'archived' })).toBe(false);
    });

    it('handles scheduled content correctly', () => {
      const now = new Date('2024-01-01T12:00:00Z');
      const pastStr = '2023-12-31T12:00:00Z';
      const futureStr = '2024-01-02T12:00:00Z';

      // Scheduled with no publishedAt -> false
      expect(isContentPublic({ ...dummyEn, status: 'scheduled' }, now)).toBe(false);
      // Scheduled past -> true
      expect(isContentPublic({ ...dummyEn, status: 'scheduled', publishedAt: pastStr }, now)).toBe(true);
      // Scheduled future -> false
      expect(isContentPublic({ ...dummyEn, status: 'scheduled', publishedAt: futureStr }, now)).toBe(false);
    });
  });

  describe('Zod Schema Validation (Slugs & Relations)', () => {
    it('rejects invalid slugs', () => {
      const testSlug = (slug: string) => {
        const item = { ...dummyEn, slug };
        return universalContentSchema.safeParse(item).success;
      };

      expect(testSlug('valid-slug-123')).toBe(true);
      
      // Spaces, caps, underscores, double hyphens, trailing/leading
      expect(testSlug('Invalid-slug')).toBe(false);
      expect(testSlug('invalid_slug')).toBe(false);
      expect(testSlug('invalid slug')).toBe(false);
      expect(testSlug('-invalid')).toBe(false);
      expect(testSlug('invalid-')).toBe(false);
      expect(testSlug('invalid--slug')).toBe(false);
      expect(testSlug('features')).toBe(false); // reserved
    });
  });

  describe('validateContentDatabase (Integrity)', () => {
    it('rejects duplicate type + locale + slug', () => {
      const data = [dummyEn, { ...dummyEn, id: 'another_id' }];
      expect(() => validateContentDatabase(data)).toThrow('Duplicate Slug Combination');
    });

    it('rejects dead relations', () => {
      const badRel: UniversalContent = {
        ...dummyEn,
        relations: [{ targetId: 'does_not_exist', relationType: 'related' }]
      };
      expect(() => validateContentDatabase([badRel])).toThrow('Dead link found');
    });

    it('rejects missing translation groups', () => {
      const badGroup: UniversalContent = { ...dummyEn, translationGroupId: 'feat_99' };
      expect(() => validateContentDatabase([badGroup, dummyDe])).toThrow('Translation group missing');
    });
  });

  describe('Routing & hreflang rules', () => {
    it('generates localized paths correctly', () => {
      expect(getLocalizedContentPath(dummyEn)).toBe('/en/features/my-feature');
      expect(getLocalizedContentPath(dummyDe)).toBe('/de/funktionen/mein-feature');
    });

    it('creates translation alternates and ignores noIndex/draft', () => {
      const noIndexDe = { ...dummyDe, noIndex: true };
      const draftEn = { ...dummyEn, status: 'draft' as const };
      
      const res1 = getTranslationAlternates([dummyEn, dummyDe]);
      expect(res1.xDefault).toBe('https://tunerportal.com/en/features/my-feature');
      expect(res1.alternates['de']).toBe('https://tunerportal.com/de/funktionen/mein-feature');

      // DE is noIndex -> Should not be in alternates
      const res2 = getTranslationAlternates([dummyEn, noIndexDe]);
      expect(res2.alternates['de']).toBeUndefined();

      // EN is draft -> Should not be in alternates, xDefault should fall back to next available (DE)
      const res3 = getTranslationAlternates([draftEn, dummyDe]);
      expect(res3.alternates['en']).toBeUndefined();
      expect(res3.xDefault).toBe('https://tunerportal.com/de/funktionen/mein-feature');
    });
  });

  describe('Comparison Table Module', () => {
    it('validates a correct comparison table', () => {
      const data = {
        _type: 'comparisonTable',
        columns: [
          { id: 'c1', name: 'A', status: 'confirmed' },
          { id: 'c2', name: 'B', status: 'confirmed' }
        ],
        rows: [
          {
            id: 'r1',
            label: 'Feature X',
            values: [
              { entityId: 'c1', valueType: 'boolean', value: true, status: 'confirmed', internalOnly: true },
              { entityId: 'c2', valueType: 'boolean', value: false, status: 'confirmed', verifiedAt: new Date().toISOString() }
            ]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('fails if external confirmed value is missing verifiedAt', () => {
      const data = {
        _type: 'comparisonTable',
        columns: [
          { id: 'c1', name: 'A', status: 'confirmed' }
        ],
        rows: [
          {
            id: 'r1',
            label: 'Feature X',
            values: [
              { entityId: 'c1', valueType: 'boolean', value: true, status: 'confirmed', internalOnly: false }
            ]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('verifiedAt is required');
      }
    });

    it('fails on duplicate column id', () => {
      const data = {
        _type: 'comparisonTable',
        columns: [
          { id: 'c1', name: 'A', status: 'confirmed' },
          { id: 'c1', name: 'B', status: 'confirmed' }
        ],
        rows: [
          { id: 'r1', label: 'Feature', values: [{ entityId: 'c1', valueType: 'boolean', value: true, status: 'needs_review' }] }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('Duplicate column id'))).toBe(true);
      }
    });

    it('fails on mismatched value length', () => {
      const data = {
        _type: 'comparisonTable',
        columns: [
          { id: 'c1', name: 'A', status: 'confirmed' },
          { id: 'c2', name: 'B', status: 'confirmed' }
        ],
        rows: [
          {
            id: 'r1',
            label: 'Feature X',
            values: [
              { entityId: 'c1', valueType: 'boolean', value: true, status: 'needs_review' }
            ]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('exactly 2 values'))).toBe(true);
      }
    });

    it('fails on unknown entityId reference', () => {
      const data = {
        _type: 'comparisonTable',
        columns: [
          { id: 'c1', name: 'A', status: 'confirmed' }
        ],
        rows: [
          {
            id: 'r1',
            label: 'Feature X',
            values: [
              { entityId: 'c2', valueType: 'boolean', value: true, status: 'needs_review' }
            ]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('Unknown entityId reference'))).toBe(true);
      }
    });
  });

  describe('Pricing Table Module', () => {
    it('validates a correct pricing table', () => {
      const data = {
        _type: 'pricingTable',
        plans: [
          {
            id: 'p1',
            name: 'Basic',
            amount: {
              pricingType: 'fixed',
              billingPeriod: 'month',
              prices: [{ currency: 'EUR', minorAmount: 2900 }]
            },
            status: 'confirmed',
            internalOnly: true,
            features: [
              { id: 'f1', label: 'Feature', included: true, status: 'confirmed' }
            ],
            ctas: [
              { id: 'c1', label: 'Buy', href: '#', status: 'confirmed' }
            ]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('fails if max is less than min in range', () => {
      const data = {
        _type: 'pricingTable',
        plans: [
          {
            id: 'p1',
            name: 'Basic',
            amount: {
              pricingType: 'range',
              prices: [{ currency: 'EUR', minorAmount: 5000, maximumMinorAmount: 2000 }]
            },
            status: 'confirmed',
            internalOnly: true,
            features: [
              { id: 'f1', label: 'Feature', included: true, status: 'confirmed' }
            ],
            ctas: [
              { id: 'c1', label: 'Buy', href: '#', status: 'confirmed' }
            ]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('must be less than'))).toBe(true);
      }
    });

    it('fails if referenced footnote does not exist', () => {
      const data = {
        _type: 'pricingTable',
        plans: [
          {
            id: 'p1',
            name: 'Basic',
            amount: { pricingType: 'free' },
            status: 'confirmed',
            internalOnly: true,
            features: [
              { id: 'f1', label: 'Feature', included: true, status: 'confirmed', footnoteRefs: ['fn_missing'] }
            ],
            ctas: [{ id: 'c1', label: 'Buy', href: '#', status: 'confirmed' }]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('Unknown footnoteRef'))).toBe(true);
      }
    });

    it('fails if referenced footnote scope is not used', () => {
      const data = {
        _type: 'pricingTable',
        footnotes: [
          { id: 'fn1', scope: 'referenced', symbol: '*', text: 'Conditions apply' }
        ],
        plans: [
          {
            id: 'p1',
            name: 'Basic',
            amount: { pricingType: 'free' },
            status: 'confirmed',
            internalOnly: true,
            features: [
              { id: 'f1', label: 'Feature', included: true, status: 'confirmed' } // footnoteRef omitted
            ],
            ctas: [{ id: 'c1', label: 'Buy', href: '#', status: 'confirmed' }]
          }
        ]
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('is never referenced'))).toBe(true);
      }
    });
  describe('Lead Capture Form Module', () => {
    it('validates a correct lead capture form', () => {
      const data = {
        _type: 'leadCaptureForm',
        id: 'form1',
        submitLabel: 'Submit',
        sections: [
          {
            id: 's1',
            status: 'confirmed',
            content: [
              {
                type: 'text',
                id: 'field_name',
                name: 'firstName',
                label: 'First Name',
                status: 'confirmed'
              }
            ]
          }
        ],
        consents: [
          {
            id: 'c1',
            type: 'dsgvo',
            version: 'v1',
            required: true,
            text: 'I agree',
            status: 'confirmed'
          }
        ],
        successActions: [
          { type: 'message', heading: 'Thanks', text: 'We will contact you', status: 'confirmed' }
        ],
        errorMessages: {
          generalError: 'Error',
          networkError: 'Network Error',
          validationError: 'Validation Error',
          rateLimitError: 'Too many requests'
        }
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('fails on duplicate field ids', () => {
      const data = {
        _type: 'leadCaptureForm',
        id: 'form2',
        submitLabel: 'Submit',
        sections: [
          {
            id: 's1',
            status: 'confirmed',
            content: [
              { type: 'text', id: 'f1', name: 'firstName', label: 'First Name', status: 'confirmed' },
              { type: 'email', id: 'f1', name: 'email', label: 'Email', status: 'confirmed' }
            ]
          }
        ],
        consents: [],
        successActions: [],
        errorMessages: { generalError: '', networkError: '', validationError: '', rateLimitError: '' }
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('Duplicate field'))).toBe(true);
      }
    });

    it('fails if condition references unknown field', () => {
      const data = {
        _type: 'leadCaptureForm',
        id: 'form3',
        submitLabel: 'Submit',
        sections: [
          {
            id: 's1',
            status: 'confirmed',
            content: [
              { 
                type: 'text', 
                id: 'f1', 
                name: 'lastName', 
                label: 'Last Name', 
                status: 'confirmed',
                conditions: [{ dependsOnId: 'unknown_f2', operator: 'equals', value: 'yes' }]
              }
            ]
          }
        ],
        consents: [],
        successActions: [],
        errorMessages: { generalError: '', networkError: '', validationError: '', rateLimitError: '' }
      };
      const result = contentModuleSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.message.includes('Condition references unknown field'))).toBe(true);
      }
    });
  });
});
});

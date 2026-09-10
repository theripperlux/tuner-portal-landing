import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Tabs } from '@/components/ui/Tabs';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FeatureGridModule } from '@/components/modules/FeatureGridModule';
import { StatisticsModule } from '@/components/modules/StatisticsModule';
import { TestimonialsModule } from '@/components/modules/TestimonialsModule';
import { ComparisonTableModule } from '@/components/modules/ComparisonTableModule';
import PricingTableModule from '@/components/modules/PricingTableModule';

export const metadata = {
  title: 'Component Preview',
  robots: 'noindex, nofollow',
};

export default function ComponentPreviewPage() {
  return (
    <div className="bg-background min-h-screen text-foreground p-12 space-y-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-['Outfit'] mb-2">Component Preview</h1>
        <p className="text-secondary-fg opacity-80">This page is strictly for internal development and has a noindex meta tag.</p>
      </div>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Button variant="default">Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <Button variant="default" size="sm">Small</Button>
          <Button variant="default" size="default">Default</Button>
          <Button variant="default" size="lg">Large</Button>
          <Button variant="default" isLoading>Loading</Button>
          <Button variant="default" disabled>Disabled</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>A descriptive text for this card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Main content area for the card component.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Accordion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Accordion</h2>
        <div className="max-w-xl">
          <Accordion>
            <AccordionItem title="What is TunerPortal?">
              TunerPortal is the world's leading White-Label ECU Tuning Platform.
            </AccordionItem>
            <AccordionItem title="Is it accessible?">
              Yes. It adheres to standard ARIA guidelines and can be navigated via keyboard.
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Tabs</h2>
        <div className="max-w-2xl">
          <Tabs 
            tabs={[
              { id: 'tab1', label: 'Preview', content: <div className="p-4 border border-secondary rounded-xl mt-4">Preview Content Here</div> },
              { id: 'tab2', label: 'Code', content: <div className="p-4 border border-secondary rounded-xl mt-4 bg-secondary font-mono text-sm">Code Content Here</div> }
            ]}
          />
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Breadcrumbs</h2>
        <Breadcrumbs 
          items={[
            { label: 'Solutions', href: '/solutions' },
            { label: 'Start a File Service' }
          ]} 
        />
      </section>
      {/* Feature Grid Module */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Feature Grid (Detailed Variant)</h2>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <FeatureGridModule 
            module={{
              _type: 'featureGrid',
              heading: 'Platform Capabilities',
              description: 'Explore the full spectrum of tools designed to accelerate your tuning business.',
              variant: 'detailed',
              columns: 3,
              items: [
                {
                  id: 'fg1',
                  status: 'confirmed',
                  title: 'Automated File Processing',
                  description: 'Instantly process standard files using our proprietary ML-based file matching system, reducing manual labor by up to 80%.',
                  badge: 'Popular',
                  category: 'Core Feature',
                  isHighlighted: true,
                  cta: { type: 'internal', href: '#', label: 'See How it Works' }
                },
                {
                  id: 'fg2',
                  status: 'confirmed',
                  title: 'White-Label Portal',
                  description: 'Provide a seamless experience to your dealer network with a fully branded portal on your own domain.',
                  category: 'B2B',
                  link: { type: 'internal', href: '#', label: 'Explore Portal' }
                },
                {
                  id: 'fg3',
                  status: 'confirmed',
                  title: 'Integrated Billing',
                  description: 'Automatically charge credits, generate invoices, and handle VAT calculation without leaving the platform.',
                  category: 'Finance'
                },
                {
                  id: 'fg-hidden',
                  status: 'needs_review',
                  title: 'Secret Upcoming Feature',
                  description: 'This feature is needs_review and should NOT be rendered in public if we filter it out (but dev preview shows it because we only passed confirmed ones!). Wait, the component filters them, so this will NOT be visible!',
                  category: 'Test'
                }
              ]
            }} 
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Feature Grid (Screenshots Variant)</h2>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <FeatureGridModule 
            module={{
              _type: 'featureGrid',
              variant: 'with-screenshots',
              columns: 2,
              items: [
                {
                  id: 'fg4',
                  status: 'confirmed',
                  title: 'Real-time Dashboard',
                  description: 'Monitor all your ticket queues, active tuners, and daily revenue at a glance.',
                  image: '/website2.jpeg',
                  imageAlt: 'Dashboard Screenshot'
                },
                {
                  id: 'fg5',
                  status: 'confirmed',
                  title: 'Vehicle Database',
                  description: 'Access the most comprehensive vehicle and ECU database directly within the ticket system.',
                  image: '/tunerportal_logo_transparent.png',
                  imageAlt: 'Database Screenshot'
                }
              ]
            }} 
          />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Statistics Module</h2>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <StatisticsModule 
            module={{
              _type: 'statistics',
              heading: 'Platform Insights',
              description: 'Real data driving our tuning network forward.',
              items: [
                {
                  id: 's1',
                  status: 'confirmed',
                  value: 12500,
                  valueType: 'integer',
                  label: 'Files Processed',
                  description: 'Eine extrem lange deutsche Beschriftung, um zu testen, wie die Komponente reagiert, wenn sehr viel Text als Beschreibung für eine einzelne Kennzahl übergeben wird, damit das Layout nicht kaputt geht.',
                  locale: 'de',
                  sourceLabel: 'Interne DB'
                },
                {
                  id: 's2',
                  status: 'confirmed',
                  value: 99.95,
                  valueType: 'percentage',
                  precision: 2,
                  label: 'Uptime',
                  locale: 'en',
                  sourceLabel: 'StatusPage',
                  sourceUrl: 'https://status.tunerportal.com'
                },
                {
                  id: 's3',
                  status: 'confirmed',
                  value: 1599.50,
                  valueType: 'currency',
                  unit: 'EUR',
                  precision: 2,
                  label: 'Average Revenue / Tuner',
                  locale: 'de',
                  sourceLabel: 'Finanzen 2023',
                  trend: {
                    previousValue: 1200,
                    currentValue: 1599.50,
                    comparisonPeriod: 'Last Year',
                    trendDirection: 'up',
                    source: 'Annual Report',
                    verifiedAt: new Date().toISOString()
                  }
                },
                {
                  id: 's4',
                  status: 'confirmed',
                  value: 14.5,
                  valueType: 'decimal',
                  precision: 1,
                  label: 'Average Response Time (mins)',
                  locale: 'en',
                  sourceLabel: 'Zendesk',
                  trend: {
                    previousValue: 20,
                    currentValue: 14.5,
                    comparisonPeriod: 'Last Month',
                    trendDirection: 'down',
                    source: 'Zendesk',
                    verifiedAt: new Date().toISOString()
                  }
                },
                {
                  id: 's-needs-review',
                  status: 'needs_review',
                  value: 1000000,
                  valueType: 'count',
                  label: 'Should Not Render (needs_review)',
                  locale: 'en'
                },
                {
                  id: 's-expired',
                  status: 'confirmed',
                  value: 50,
                  valueType: 'integer',
                  label: 'Should Not Render (Expired)',
                  locale: 'en',
                  expiresAt: '2020-01-01T00:00:00Z',
                  sourceLabel: 'Old Data'
                }
              ]
            }} 
          />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Testimonials Module</h2>
        
        <h3 className="text-xl font-bold mt-8 mb-4">Grid Variant (Default)</h3>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <TestimonialsModule 
            module={{
              _type: 'testimonials',
              variant: 'grid',
              heading: 'What our partners say',
              items: [
                {
                  id: 't1',
                  status: 'confirmed',
                  consentConfirmed: true,
                  quote: 'Ein extrem langes deutsches Zitat, um sicherzustellen, dass die Cards im Grid auch bei massiv unterschiedlichen Textlängen sauber abschließen und sich in der Höhe angleichen, ohne dass das Layout bricht. Das ist für responsive Web-Entwicklung essenziell.',
                  locale: 'de',
                  name: 'Max Mustermann',
                  role: 'CEO',
                  company: 'Tuning Experts GmbH',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Interview',
                  image: '/website2.jpeg'
                },
                {
                  id: 't2',
                  status: 'confirmed',
                  consentConfirmed: true,
                  quote: 'This platform saved us hundreds of hours in manual file routing.',
                  locale: 'en',
                  name: 'John Smith',
                  role: 'Head of Operations',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Email',
                  caseStudyLink: '#'
                },
                {
                  id: 't3',
                  status: 'confirmed',
                  consentConfirmed: true,
                  anonymized: true,
                  displayName: 'Master Tuner aus Europa',
                  quote: 'Wir konnten unseren Umsatz durch das White-Label Portal verdreifachen.',
                  locale: 'de',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Feedback-Formular',
                  logo: '/tunerportal_logo_transparent.png'
                }
              ]
            }} 
          />
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">Horizontal Scroll Variant</h3>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <TestimonialsModule 
            module={{
              _type: 'testimonials',
              variant: 'horizontal-scroll',
              items: [
                {
                  id: 't4',
                  status: 'confirmed',
                  consentConfirmed: true,
                  quote: 'Super reliable API for our custom ERP integration.',
                  locale: 'en',
                  name: 'Alice Johnson',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Email'
                },
                {
                  id: 't5',
                  status: 'confirmed',
                  consentConfirmed: true,
                  quote: 'El mejor servicio del mercado.',
                  originalQuote: 'El mejor servicio del mercado.',
                  locale: 'de',
                  translated: true,
                  translationReviewed: true,
                  name: 'Carlos R.',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Trustpilot'
                },
                {
                  id: 't6',
                  status: 'confirmed',
                  consentConfirmed: true,
                  quote: 'Ungeprüfte Übersetzung - Wird ausgeblendet!',
                  locale: 'de',
                  translated: true,
                  translationReviewed: false,
                  name: 'Should Not Appear',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Email'
                },
                {
                  id: 't7',
                  status: 'needs_review',
                  consentConfirmed: true,
                  quote: 'Needs Review - Wird ausgeblendet!',
                  locale: 'de',
                  name: 'Should Not Appear',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Email'
                },
                {
                  id: 't8',
                  status: 'confirmed',
                  consentConfirmed: false,
                  quote: 'No Consent - Wird ausgeblendet!',
                  locale: 'de',
                  name: 'Should Not Appear',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Email'
                },
                {
                  id: 't9',
                  status: 'confirmed',
                  consentConfirmed: true,
                  withdrawalAt: '2020-01-01T00:00:00Z',
                  quote: 'Withdrawn Consent - Wird ausgeblendet!',
                  locale: 'de',
                  name: 'Should Not Appear',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Email'
                }
              ]
            }} 
          />
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">Featured Variant</h3>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <TestimonialsModule 
            module={{
              _type: 'testimonials',
              variant: 'featured',
              items: [
                {
                  id: 'tf1',
                  status: 'confirmed',
                  consentConfirmed: true,
                  quote: 'TunerPortal is the backbone of our global distribution network. We process over 500 files a day automatically.',
                  locale: 'en',
                  name: 'David Lee',
                  company: 'Enterprise Tuning',
                  role: 'CTO',
                  verifiedAt: new Date().toISOString(),
                  quoteSource: 'Case Study Interview',
                  caseStudyLink: '#',
                  image: '/website2.jpeg'
                }
              ]
            }} 
          />
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">Empty / Filtered Out Result</h3>
        <div className="bg-background rounded-xl border border-secondary p-4">
          <p className="text-sm text-secondary-fg mb-4">Below is a module where all items are filtered out (needs_review, missing consent, etc). It should render nothing.</p>
          <div className="border border-dashed border-danger/50 p-4 rounded bg-danger/5">
            <TestimonialsModule 
              module={{
                _type: 'testimonials',
                heading: 'This Should Not Be Visible',
                items: [
                  {
                    id: 'tx1',
                    status: 'rejected',
                    consentConfirmed: true,
                    quote: 'Bad quote',
                    locale: 'en',
                    name: 'Test',
                    verifiedAt: new Date().toISOString(),
                    quoteSource: 'Email'
                  }
                ]
              }} 
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-secondary pb-2">Comparison Table Module</h2>
        
        <h3 className="text-xl font-bold mt-8 mb-4">Competitor Comparison</h3>
        <div className="bg-background rounded-xl border border-secondary overflow-hidden">
          <ComparisonTableModule 
            module={{
              _type: 'comparisonTable',
              heading: 'TunerPortal vs Legacy Tools',
              description: 'A strictly verified, objective comparison.',
              comparisonType: 'alternatives',
              columns: [
                {
                  id: 'tp',
                  name: 'TunerPortal',
                  isPrimary: true,
                  status: 'confirmed',
                  logo: '/tunerportal_logo_transparent.png',
                  logoAlt: 'TunerPortal Logo'
                },
                {
                  id: 'legacy',
                  name: 'Legacy Software',
                  description: 'Traditional desktop-based tuning management.',
                  status: 'confirmed'
                },
                {
                  id: 'unconfirmed',
                  name: 'Should Not Appear',
                  status: 'needs_review'
                }
              ],
              rows: [
                {
                  id: 'r1',
                  label: 'Web-based Platform',
                  tooltip: 'Access your tuning business from any browser, anywhere.',
                  values: [
                    { entityId: 'tp', value: true, valueType: 'boolean', status: 'confirmed', internalOnly: true },
                    { entityId: 'legacy', value: false, valueType: 'boolean', status: 'confirmed', verifiedAt: new Date().toISOString(), sourceLabel: 'Industry Standard Review' },
                    { entityId: 'unconfirmed', value: true, valueType: 'boolean', status: 'confirmed', internalOnly: true }
                  ]
                },
                {
                  id: 'r2',
                  label: 'Average Uptime',
                  values: [
                    { entityId: 'tp', value: 99.95, valueType: 'percentage', status: 'confirmed', internalOnly: true, note: 'SLA backed' },
                    { entityId: 'legacy', value: null, valueType: 'unknown', status: 'confirmed', verifiedAt: new Date().toISOString(), note: 'Not officially published' }
                  ]
                },
                {
                  id: 'r3',
                  label: 'Automated Billing',
                  values: [
                    { entityId: 'tp', value: ['Stripe', 'PayPal', 'Wire'], valueType: 'list', status: 'confirmed', internalOnly: true },
                    { entityId: 'legacy', value: 'Manual Invoicing Only', valueType: 'text', status: 'confirmed', verifiedAt: new Date().toISOString(), sourceLabel: 'Manual Documentation', sourceUrl: '#' }
                  ]
                },
                {
                  id: 'r4',
                  label: 'Hidden Values Row',
                  description: 'This row should not appear because its external values have no verifiedAt and the internal value is needs_review.',
                  values: [
                    { entityId: 'tp', value: true, valueType: 'boolean', status: 'needs_review', internalOnly: true },
                    { entityId: 'legacy', value: false, valueType: 'boolean', status: 'confirmed' } // missing verifiedAt
                  ]
                },
                {
                  id: 'r5',
                  label: 'Hardware Compatibility',
                  values: [
                    { entityId: 'tp', value: null, valueType: 'not_applicable', status: 'confirmed', internalOnly: true, note: 'We are pure SaaS' },
                    { entityId: 'legacy', value: ['Dongle A', 'Dongle B'], valueType: 'list', status: 'confirmed', verifiedAt: new Date().toISOString() }
                  ]
                }
              ]
            }} 
          />
        </div>
        
        <h3 className="text-xl font-bold mt-8 mb-4">Hardening & Filter Scenarios</h3>
        <div className="space-y-4">
          <div className="bg-background rounded-xl border border-secondary overflow-hidden">
            <ComparisonTableModule 
              module={{
                _type: 'comparisonTable',
                heading: 'Completely Filtered Out Table',
                description: 'This entire table should disappear because it has no publishable rows remaining.',
                comparisonType: 'features',
                columns: [
                  { id: 'tp', name: 'TunerPortal', status: 'confirmed' }
                ],
                rows: [
                  {
                    id: 'r1',
                    label: 'Unpublished Feature',
                    values: [
                      { entityId: 'tp', value: true, valueType: 'boolean', status: 'needs_review', internalOnly: true }
                    ]
                  }
                ]
              }} 
            />
          </div>

          <div className="bg-background rounded-xl border border-secondary overflow-hidden">
            <ComparisonTableModule 
              module={{
                _type: 'comparisonTable',
                heading: 'Extremely Wide Table (10+ Columns) & Long Translations',
                description: 'Testing horizontal scroll behaviour and responsiveness.',
                comparisonType: 'features',
                columns: Array.from({ length: 12 }).map((_, i) => ({
                  id: `col${i}`,
                  name: `Competitor ${i + 1}`,
                  status: 'confirmed'
                })),
                rows: [
                  {
                    id: 'r1',
                    label: 'Dies ist eine außergewöhnlich lange deutsche Feature-Beschreibung, die testen soll, ob das Layout die Zeilen-Titel korrekt umbricht oder abschneidet.',
                    values: Array.from({ length: 12 }).map((_, i) => ({
                      entityId: `col${i}`,
                      value: i % 2 === 0,
                      valueType: 'boolean',
                      status: 'confirmed',
                      verifiedAt: new Date().toISOString()
                    }))
                  }
                ]
              }} 
            />
          </div>
        </div>
      </section>

      {/* PRICING TABLE PREVIEW */}
      <section className="mb-24">
        <div className="mb-8 border-b border-secondary pb-4">
          <h2 className="text-3xl font-bold font-['Outfit'] flex items-center gap-3">
            <span className="bg-primary/10 text-primary p-2 rounded-lg">5</span>
            Pricing Table
          </h2>
          <p className="text-secondary-fg mt-2">
            Renders strictly verified pricing plans. Uses Intl.NumberFormat for minor units and filters out invalid/expired deals.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-background rounded-xl border border-secondary overflow-hidden">
            <PricingTableModule 
              module={{
                _type: 'pricingTable',
                heading: 'Choose Your Plan',
                description: 'Transparent pricing for every stage of your business.',
                footnotes: [
                  { id: 'fn1', scope: 'referenced', symbol: '*', text: 'Fair use limits apply.' }
                ],
                plans: [
                  {
                    id: 'p1',
                    name: 'Starter',
                    description: 'Perfect for small tuning shops just getting started.',
                    amount: {
                      pricingType: 'free'
                    },
                    status: 'confirmed',
                    features: [
                      { id: 'f1', label: 'Tuning File Portal', included: true, status: 'confirmed' },
                      { id: 'f2', label: 'Basic CRM', included: true, status: 'confirmed' },
                      { id: 'f3', label: 'White-Label Branding', included: false, status: 'confirmed' }
                    ],
                    limits: [
                      { id: 'l1', metric: 'File Uploads', value: '10/mo', limitType: 'hard', status: 'confirmed' }
                    ],
                    ctas: [
                      { id: 'c1', label: 'Get Started Free', href: '#', status: 'confirmed' }
                    ]
                  },
                  {
                    id: 'p2',
                    name: 'Professional',
                    description: 'For established businesses needing white-label solutions.',
                    badge: { text: 'Most Popular', variant: 'primary' },
                    recommendation: {
                      status: 'confirmed',
                      label: 'Recommended'
                    },
                    amount: {
                      pricingType: 'fixed',
                      billingPeriod: 'month',
                      prices: [{ currency: 'EUR', minorAmount: 9900 }] // 99.00 EUR
                    },
                    tax: { type: 'excluded', label: 'Plus VAT' },
                    status: 'confirmed',
                    features: [
                      { id: 'f4', label: 'Tuning File Portal', included: true, status: 'confirmed' },
                      { id: 'f5', label: 'Advanced CRM', included: true, status: 'confirmed' },
                      { id: 'f6', label: 'White-Label Branding', included: true, footnoteRefs: ['fn1'], status: 'confirmed' },
                      { id: 'f7', label: 'API Access', included: 'Read-only', status: 'confirmed' }
                    ],
                    limits: [
                      { id: 'l2', metric: 'File Uploads', value: 'Unlimited', limitType: 'fair_use', footnoteRefs: ['fn1'], status: 'confirmed' }
                    ],
                    ctas: [
                      { id: 'c2', label: 'Start 14-Day Trial', href: '#', isPrimary: true, status: 'confirmed' }
                    ]
                  },
                  {
                    id: 'p3',
                    name: 'Enterprise',
                    description: 'Custom solutions for large networks.',
                    amount: {
                      pricingType: 'contact_sales',
                      label: 'Contact Sales'
                    },
                    status: 'confirmed',
                    features: [
                      { id: 'f8', label: 'Everything in Pro', included: true, status: 'confirmed' },
                      { id: 'f9', label: 'Custom Integrations', included: true, status: 'confirmed' },
                      { id: 'f10', label: 'Dedicated Account Manager', included: true, status: 'confirmed' }
                    ],
                    ctas: [
                      { id: 'c3', label: 'Contact Sales', href: '#', status: 'confirmed' }
                    ]
                  }
                ]
              }} 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

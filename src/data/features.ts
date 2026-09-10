import { UniversalContent } from '@/types/content';

const now = new Date().toISOString();

export const featuresData: UniversalContent[] = [
  // 1. White Label Platform (EN)
  {
    id: 'feat_whitelabel_en',
    type: 'feature',
    slug: 'white-label-platform',
    locale: 'en',
    translationGroupId: 'feat_whitelabel',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['branding', 'whitelabel'],
    categories: ['Platform'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'White Label Tuning Platform',
    seo: {
      metaTitle: 'Custom Branded White Label ECU Tuning Platform',
      metaDescription: 'Launch your own fully branded B2B tuning file service with TunerPortal. Custom domain, emails, logo, and colors. 100% white-label.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'commercial',
      priority: 0.9,
    },
    ai: {},
    relations: [
      { targetId: 'feat_api_en', relationType: 'related' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Your Brand. Your Portal.',
          subtitle: 'Launch your B2B file service with a 100% white-label platform under your own domain.',
          ctaText: 'Start Free Trial',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Custom Domain', description: 'Host the portal on your own domain (e.g., portal.yourcompany.com).' },
            { title: 'Brand Colors & Logo', description: 'Customize the entire UI to match your corporate identity.' },
            { title: 'White-Label Emails', description: 'All automated emails are sent via your own SMTP server.' }
          ]
        }
      ]
    }
  },
  // 1. White Label Platform (DE)
  {
    id: 'feat_whitelabel_de',
    type: 'feature',
    slug: 'white-label-plattform',
    locale: 'de',
    translationGroupId: 'feat_whitelabel',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['branding', 'whitelabel'],
    categories: ['Platform'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'White Label Tuning Plattform',
    seo: {
      metaTitle: 'Deine eigene White Label Chiptuning Plattform',
      metaDescription: 'Starte deinen eigenen B2B Tuning-File-Service mit TunerPortal. Eigene Domain, Emails, Logo und Farben. 100% White-Label.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'commercial',
      priority: 0.9,
    },
    ai: {},
    relations: [
      { targetId: 'feat_api_de', relationType: 'related' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Deine Marke. Dein Portal.',
          subtitle: 'Starte deinen B2B File-Service mit einer 100% White-Label Plattform unter deiner eigenen Domain.',
          ctaText: 'Kostenlos testen',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Eigene Domain', description: 'Hoste das Portal auf deiner eigenen Domain (z.B. portal.deinefirma.de).' },
            { title: 'Markenfarben & Logo', description: 'Passe die gesamte Benutzeroberfläche an deine Corporate Identity an.' },
            { title: 'White-Label E-Mails', description: 'Alle automatisierten E-Mails werden über deinen eigenen SMTP-Server versendet.' }
          ]
        }
      ]
    }
  },
  // 2. Customer Management (EN)
  {
    id: 'feat_crm_en',
    type: 'feature',
    slug: 'customer-management',
    locale: 'en',
    translationGroupId: 'feat_crm',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['crm', 'dealers'],
    categories: ['Management'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Customer Management (CRM)',
    seo: {
      metaTitle: 'White Label Tuning CRM & Customer Management Software',
      metaDescription: 'Manage all your B2B tuning customers, dealers, and workshops in one central dashboard. Track file history, credit balances, and support tickets.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'commercial',
      priority: 0.8,
    },
    ai: {},
    relations: [
      { targetId: 'feat_billing_en', relationType: 'integrates_with' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Smart Customer Management',
          subtitle: 'A fully integrated CRM built specifically for the chiptuning industry.',
          ctaText: 'Start Free Trial',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Dealer Overview', description: 'Complete overview of dealer activity and file history.' },
            { title: 'Pricing Tiers', description: 'Automatic grouping into custom pricing tiers (B2B, Master, Slave).' },
            { title: 'Account Control', description: 'One-click suspension of unpaid or fraudulent accounts.' }
          ]
        }
      ]
    }
  },
  // 2. Customer Management (DE)
  {
    id: 'feat_crm_de',
    type: 'feature',
    slug: 'kundenverwaltung',
    locale: 'de',
    translationGroupId: 'feat_crm',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['crm', 'dealers'],
    categories: ['Management'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Kundenverwaltung (CRM)',
    seo: {
      metaTitle: 'White Label Tuning CRM & Kundenverwaltung',
      metaDescription: 'Verwalte alle deine B2B Tuning-Kunden, Händler und Werkstätten in einem zentralen Dashboard. Verfolge Dateihistorie, Guthaben und Tickets.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'commercial',
      priority: 0.8,
    },
    ai: {},
    relations: [
      { targetId: 'feat_billing_de', relationType: 'integrates_with' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Smarte Kundenverwaltung',
          subtitle: 'Ein vollständig integriertes CRM, das speziell für die Chiptuning-Branche entwickelt wurde.',
          ctaText: 'Kostenlos testen',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Händler-Übersicht', description: 'Komplette Übersicht über Händleraktivitäten und Dateihistorie.' },
            { title: 'Preisgruppen', description: 'Automatische Gruppierung in individuelle Preisstufen (B2B, Master, Slave).' },
            { title: 'Account-Kontrolle', description: 'Sperre unbezahlte oder betrügerische Accounts mit einem Klick.' }
          ]
        }
      ]
    }
  },
  // 3. Billing & Invoicing (EN)
  {
    id: 'feat_billing_en',
    type: 'feature',
    slug: 'billing-invoicing',
    locale: 'en',
    translationGroupId: 'feat_billing',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['billing', 'payments'],
    categories: ['Finance'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Automated Billing & Invoicing',
    seo: {
      metaTitle: 'Automated Billing & Credit System for Tuning File Services',
      metaDescription: 'Sell tuning credits, process payments instantly via Stripe or PayPal, and automatically generate compliant invoices for every transaction.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'commercial',
      priority: 0.9,
    },
    ai: {},
    relations: [
      { targetId: 'feat_crm_en', relationType: 'related' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Automated Billing & Invoicing',
          subtitle: 'Ensure you get paid upfront. Customers buy credit packages, and credits are instantly deducted.',
          ctaText: 'Start Free Trial',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Pre-paid System', description: 'Pre-paid credit system eliminates unpaid files.' },
            { title: 'Stripe & PayPal', description: 'Direct integration with Stripe (Credit Cards, Apple Pay) and PayPal.' },
            { title: 'PDF Invoices', description: 'Customizable PDF invoice templates automatically generated.' }
          ]
        }
      ]
    }
  },
  // 3. Billing & Invoicing (DE)
  {
    id: 'feat_billing_de',
    type: 'feature',
    slug: 'abrechnung-rechnungen',
    locale: 'de',
    translationGroupId: 'feat_billing',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['billing', 'payments'],
    categories: ['Finance'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Automatisierte Abrechnung',
    seo: {
      metaTitle: 'Guthabensystem & Abrechnung für Tuning File Services',
      metaDescription: 'Verkaufe Tuning-Credits, verarbeite Zahlungen sofort via Stripe oder PayPal und erstelle vollautomatisiert rechtskonforme Rechnungen.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'commercial',
      priority: 0.9,
    },
    ai: {},
    relations: [
      { targetId: 'feat_crm_de', relationType: 'related' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Automatisierte Abrechnung',
          subtitle: 'Sichere Vorauszahlungen. Kunden kaufen Guthabenpakete, und Credits werden bei Download sofort abgezogen.',
          ctaText: 'Kostenlos testen',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Pre-paid System', description: 'Das Guthabensystem eliminiert unbezahlte Dateien vollständig.' },
            { title: 'Stripe & PayPal', description: 'Direkte Integration mit Stripe (Kreditkarte, Apple Pay) und PayPal.' },
            { title: 'PDF Rechnungen', description: 'Automatisch generierte, anpassbare PDF-Rechnungen im CI-Design.' }
          ]
        }
      ]
    }
  },
  // 4. AI Automation (EN)
  {
    id: 'feat_ai_en',
    type: 'feature',
    slug: 'ai-automation',
    locale: 'en',
    translationGroupId: 'feat_ai',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['ai', 'automation'],
    categories: ['Technology'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'AI File Automation',
    seo: {
      metaTitle: 'AI-Powered ECU Tuning File Automation',
      metaDescription: 'Automate DTC removal, DPF/EGR deletes, and stage tuning using AI. Process files 24/7 without manual intervention.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'informational',
      priority: 0.8,
    },
    ai: {},
    relations: [
      { targetId: 'feat_api_en', relationType: 'integrates_with' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'AI File Automation',
          subtitle: 'Let Artificial Intelligence process your slave files 24/7.',
          ctaText: 'Start Free Trial',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'DTC Removal', description: 'Automatic identification and removal of Diagnostic Trouble Codes.' },
            { title: '24/7 Processing', description: 'Serve customers around the globe without waking up.' }
          ]
        }
      ]
    }
  },
  // 4. AI Automation (DE)
  {
    id: 'feat_ai_de',
    type: 'feature',
    slug: 'ki-automatisierung',
    locale: 'de',
    translationGroupId: 'feat_ai',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['ai', 'automation'],
    categories: ['Technology'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'KI Datei-Automatisierung',
    seo: {
      metaTitle: 'KI-gesteuerte ECU Tuning Datei-Automatisierung',
      metaDescription: 'Automatisiere DTC-Entfernung, DPF/AGR-Deaktivierung und Stage-Tuning mit Künstlicher Intelligenz. 24/7 Verarbeitung.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'informational',
      priority: 0.8,
    },
    ai: {},
    relations: [
      { targetId: 'feat_api_de', relationType: 'integrates_with' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'KI Datei-Automatisierung',
          subtitle: 'Lass Künstliche Intelligenz deine Slave-Dateien 24/7 verarbeiten.',
          ctaText: 'Kostenlos testen',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'DTC Entfernung', description: 'Automatische Identifikation und Entfernung von Fehlercodes.' },
            { title: '24/7 Verarbeitung', description: 'Bediene Kunden weltweit, ohne aufstehen zu müssen.' }
          ]
        }
      ]
    }
  },
  // 5. API Integration (EN)
  {
    id: 'feat_api_en',
    type: 'feature',
    slug: 'api-integration',
    locale: 'en',
    translationGroupId: 'feat_api',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['api', 'developer'],
    categories: ['Technology'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'REST API Integration',
    seo: {
      metaTitle: 'Chiptuning REST API for External Integrations',
      metaDescription: 'Connect TunerPortal to your existing tools, slave networks, or custom backend using our robust REST API.',
      schemaTypes: ['SoftwareApplication', 'WebPage'],
      searchIntent: 'informational',
      priority: 0.7,
    },
    ai: {},
    relations: [
      { targetId: 'feat_ai_en', relationType: 'related' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Robust REST API',
          subtitle: 'Connect TunerPortal to your external systems, slave networks, and WinOLS via LuaBot.',
          ctaText: 'View Documentation',
          ctaLink: '/documentation'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Webhooks', description: 'Real-time updates for tickets, file uploads, and payments.' },
            { title: 'WinOLS LuaBot', description: 'Native integration for automatic checksums and map editing.' }
          ]
        },
        {
          _type: 'faq',
          title: 'API Integration FAQ',
          questions: [
            { question: 'Is the API well documented?', answer: 'Yes, we provide comprehensive documentation with code examples.' },
            { question: 'Are webhooks supported?', answer: 'Yes, you can register webhook endpoints for real-time event notifications.' }
          ]
        }
      ]
    }
  },
  // 5. API Integration (DE)
  {
    id: 'feat_api_de',
    type: 'feature',
    slug: 'api-integration',
    locale: 'de',
    translationGroupId: 'feat_api',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['api', 'developer'],
    categories: ['Technology'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'REST API Integration',
    seo: {
      metaTitle: 'Chiptuning REST API für externe Integrationen',
      metaDescription: 'Verbinde TunerPortal mit deinen bestehenden Tools, Slave-Netzwerken oder deinem Custom-Backend über unsere REST API.',
      schemaTypes: ['SoftwareApplication', 'WebPage', 'FAQPage'],
      searchIntent: 'informational',
      priority: 0.7,
    },
    ai: {},
    relations: [
      { targetId: 'feat_ai_de', relationType: 'related' }
    ],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Robuste REST API',
          subtitle: 'Verbinde TunerPortal mit externen Systemen, Slave-Netzwerken und WinOLS via LuaBot.',
          ctaText: 'Dokumentation ansehen',
          ctaLink: '/documentation'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Webhooks', description: 'Echtzeit-Updates für Tickets, Datei-Uploads und Zahlungen.' },
            { title: 'WinOLS LuaBot', description: 'Native Integration für automatische Checksummen und Map-Bearbeitung.' }
          ]
        },
        {
          _type: 'faq',
          title: 'Häufige Fragen zur API',
          questions: [
            { question: 'Ist die API dokumentiert?', answer: 'Ja, wir bieten eine ausführliche Dokumentation mit Codebeispielen.' },
            { question: 'Werden Webhooks unterstützt?', answer: 'Ja, du kannst Webhook-Endpoints für Echtzeit-Benachrichtigungen registrieren.' }
          ]
        }
      ]
    }
  }
];

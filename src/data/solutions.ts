import { UniversalContent } from '@/types/content';

const now = new Date().toISOString();

export const solutionsData: UniversalContent[] = [
  // 1. Start a File Service (EN)
  {
    id: 'sol_start_business_en',
    type: 'solution',
    slug: 'start-file-service',
    locale: 'en',
    translationGroupId: 'sol_start_business',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['beginners', 'business'],
    categories: ['Solutions'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Start a Tuning File Service',
    seo: {
      metaTitle: 'How to Start a Chiptuning File Service Business',
      metaDescription: 'Everything you need to start and scale a profitable B2B chiptuning file service. From white-label portal to automated billing.',
      schemaTypes: ['Article', 'WebPage'],
      searchIntent: 'informational',
      priority: 0.9,
    },
    ai: {},
    relations: [],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Launch Your Tuning Empire',
          subtitle: 'Turn your tuning skills into a scalable B2B file service business in less than 24 hours.',
          ctaText: 'Get Started Free',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Zero Coding Required', description: 'Your branded portal is ready to use immediately. No IT skills needed.' },
            { title: 'Automated Payments', description: 'Never chase invoices again. Customers pay upfront via Stripe or PayPal.' },
            { title: 'Grow Globally', description: 'Accept customers from anywhere in the world and process files 24/7.' }
          ]
        }
      ]
    }
  },
  // 1. Start a File Service (DE)
  {
    id: 'sol_start_business_de',
    type: 'solution',
    slug: 'tuning-business-starten',
    locale: 'de',
    translationGroupId: 'sol_start_business',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['beginners', 'business'],
    categories: ['Solutions'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'File Service Business starten',
    seo: {
      metaTitle: 'Wie du ein profitables Chiptuning File Service Business startest',
      metaDescription: 'Alles was du brauchst, um einen B2B Chiptuning File Service aufzubauen. White-Label Portal, automatisierte Rechnungen und mehr.',
      schemaTypes: ['Article', 'WebPage'],
      searchIntent: 'informational',
      priority: 0.9,
    },
    ai: {},
    relations: [],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Starte dein Tuning Imperium',
          subtitle: 'Mache aus deinen Tuning-Fähigkeiten in weniger als 24 Stunden ein skalierbares B2B-Business.',
          ctaText: 'Kostenlos starten',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Keine IT-Kenntnisse', description: 'Dein White-Label Portal ist sofort einsatzbereit.' },
            { title: 'Automatisierte Zahlungen', description: 'Rennt nie wieder Rechnungen hinterher. Kunden zahlen per Vorkasse (Stripe/PayPal).' },
            { title: 'Global wachsen', description: 'Akzeptiere Kunden aus der ganzen Welt und bearbeite Files 24/7.' }
          ]
        }
      ]
    }
  },
  // 2. Reseller Networks (EN)
  {
    id: 'sol_resellers_en',
    type: 'solution',
    slug: 'reseller-networks',
    locale: 'en',
    translationGroupId: 'sol_resellers',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['resellers', 'enterprise'],
    categories: ['Solutions'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'For Reseller Networks',
    seo: {
      metaTitle: 'White Label Platform for Chiptuning Reseller Networks',
      metaDescription: 'Manage hundreds of slave tools and dealers with a dedicated Master platform. Built for large-scale tuning enterprises.',
      schemaTypes: ['WebPage'],
      searchIntent: 'commercial',
      priority: 0.8,
    },
    ai: {},
    relations: [],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Built for Master Tuners',
          subtitle: 'Manage your entire dealer and slave network through a single, powerful enterprise dashboard.',
          ctaText: 'Talk to Sales',
          ctaLink: '/#contact'
        },
        {
          _type: 'featureGrid',
          items: [
            { id: 'item1_en', status: 'confirmed', title: 'Tiered Pricing', description: 'Set different credit prices for B2B, B2C, or specific top-tier dealers.' },
            { id: 'item2_en', status: 'confirmed', title: 'Sub-Dealers', description: 'Allow your dealers to have their own sub-dealers under them, all managed through your platform.' },
            { id: 'item3_en', status: 'confirmed', title: 'API Integration', description: 'Connect your ERP or use our API for external sales channels without manual syncs.' },
            { id: 'item4_en', status: 'confirmed', title: 'Dedicated Support', description: 'Priority SLA and dedicated account manager for enterprise networks.' }
          ]
        }
      ]
    }
  },
  // 2. Reseller Networks (DE)
  {
    id: 'sol_resellers_de',
    type: 'solution',
    slug: 'reseller-netzwerke',
    locale: 'de',
    translationGroupId: 'sol_resellers',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['resellers', 'enterprise'],
    categories: ['Solutions'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Für Reseller-Netzwerke',
    seo: {
      metaTitle: 'White Label Plattform für Chiptuning Reseller Netzwerke',
      metaDescription: 'Verwalte hunderte Slave-Tools und Händler mit einer dedizierten Master-Plattform. Gebaut für große Tuning-Unternehmen.',
      schemaTypes: ['WebPage'],
      searchIntent: 'commercial',
      priority: 0.8,
    },
    ai: {},
    relations: [],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Gebaut für Master Tuner',
          subtitle: 'Verwalte dein gesamtes Händler- und Slave-Netzwerk über ein einziges, leistungsstarkes Enterprise-Dashboard.',
          ctaText: 'Sales kontaktieren',
          ctaLink: '/#contact'
        },
        {
          _type: 'featureGrid',
          items: [
            { id: 'item1', status: 'confirmed', title: 'Gestaffelte Preise', description: 'Lege individuelle Preise für B2B, Master und Slave Accounts fest.' },
            { id: 'item2', status: 'confirmed', title: 'Sub-Händler', description: 'Erlaube deinen Händlern, eigene Sub-Händler in deinem Portal zu haben.' },
            { id: 'item3', status: 'confirmed', title: 'API Integration', description: 'Verbinde dein ERP-System oder nutze unsere API für Automation.' },
            { id: 'item4', status: 'confirmed', title: 'Dedizierter Support', description: 'Priority SLA und fester Account-Manager für Enterprise-Netzwerke.' }
          ]
        }
      ]
    }
  },
  // 3. Migration (EN)
  {
    id: 'sol_migration_en',
    type: 'solution',
    slug: 'migration',
    locale: 'en',
    translationGroupId: 'sol_migration',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['switch', 'migration'],
    categories: ['Solutions'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Migrate to TunerPortal',
    seo: {
      metaTitle: 'Migrate your Tuning File Service to TunerPortal',
      metaDescription: 'Switching to TunerPortal is easy and risk-free. Import your customers, files, and credit balances with zero downtime.',
      schemaTypes: ['WebPage'],
      searchIntent: 'informational',
      priority: 0.7,
    },
    ai: {},
    relations: [],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Switching is Easy',
          subtitle: 'Leave your outdated portal behind. Migrate your customers and files to TunerPortal with zero downtime.',
          ctaText: 'Start Migration',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Zero Downtime', description: 'We keep both systems running parallel until you are ready to switch the domain.' },
            { title: 'Import Customers', description: 'Easily import your entire customer base via CSV, including credit balances.' },
            { title: 'Free Support', description: 'Our engineering team will assist you personally during the entire migration.' }
          ]
        }
      ]
    }
  },
  // 3. Migration (DE)
  {
    id: 'sol_migration_de',
    type: 'solution',
    slug: 'migration',
    locale: 'de',
    translationGroupId: 'sol_migration',
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    version: 1,
    tags: ['switch', 'migration'],
    categories: ['Solutions'],
    noIndex: false,
    excludeFromSitemap: false,
    title: 'Wechsel zu TunerPortal',
    seo: {
      metaTitle: 'Wechsle mit deinem Tuning File Service zu TunerPortal',
      metaDescription: 'Der Wechsel zu TunerPortal ist einfach und sicher. Importiere deine Kunden, Dateien und Guthaben ohne Ausfallzeiten.',
      schemaTypes: ['WebPage'],
      searchIntent: 'informational',
      priority: 0.7,
    },
    ai: {},
    relations: [],
    payload: {
      modules: [
        {
          _type: 'hero',
          title: 'Der Wechsel ist einfach',
          subtitle: 'Lass dein veraltetes Portal hinter dir. Migriere deine Kunden und Dateien zu TunerPortal ohne Ausfallzeiten.',
          ctaText: 'Migration starten',
          ctaLink: '/register'
        },
        {
          _type: 'benefits',
          items: [
            { title: 'Keine Ausfallzeit', description: 'Wir lassen beide Systeme parallel laufen, bis du bereit bist, die Domain umzuleiten.' },
            { title: 'Kundenimport', description: 'Importiere deine gesamte Kundendatenbank per CSV, inklusive Guthaben.' },
            { title: 'Kostenloser Support', description: 'Unser Engineering-Team unterstützt dich persönlich während der gesamten Migration.' }
          ]
        }
      ]
    }
  }
];

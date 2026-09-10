import { MetadataRoute } from 'next';
import { contentRepository } from '../lib/api/LocalContentAdapter';
import { getTranslationAlternates, getLocalizedContentPath } from '../i18n/routing';
import { isContentPublic } from '../utils/contentUtils';
import { integrations } from '../data/integrations';
import { glossary } from '../data/glossary';
import { getAllMdxSlugs } from '../lib/mdx';

const locales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'ar', 'zh', 'no', 'pt', 'ru', 'sv'];
const domain = 'https://tunerportal.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // Home Page
  locales.forEach((locale) => {
    routes.push({
      url: `${domain}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });
  });

  // Example Static Pages
  const staticPages = [
    '/pricing',
    '/features',
    '/register',
    '/login',
    '/ai-ecu-tuning',
    '/tuning-file-service-software',
    '/reseller-management',
    '/start-ecu-tuning-business'
  ];

  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${domain}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // MDX SEO Landing Pages
  locales.forEach((locale) => {
    const lpSlugs = getAllMdxSlugs('landingpages', locale);
    lpSlugs.forEach((slug) => {
      routes.push({
        url: `${domain}/${locale}/lp/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  // MDX SEO Blog Posts
  locales.forEach((locale) => {
    const blogSlugs = getAllMdxSlugs('blog', locale);
    blogSlugs.forEach((slug) => {
      routes.push({
        url: `${domain}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // V3 Content Pages (Universal Engine)
  const features = await contentRepository.getPublishedContent('feature');
  const solutions = await contentRepository.getPublishedContent('solution');
  
  const allUniversalContent = [...features, ...solutions];
  
  // Group by translationGroupId to create hreflangs
  const groupedContent: Record<string, any[]> = {};
  allUniversalContent.forEach(f => {
    if (f.excludeFromSitemap || !isContentPublic(f) || f.noIndex) return;
    if (!groupedContent[f.translationGroupId]) {
      groupedContent[f.translationGroupId] = [];
    }
    groupedContent[f.translationGroupId].push(f);
  });

  Object.values(groupedContent).forEach((group) => {
    const { alternates, xDefault } = getTranslationAlternates(group);

    group.forEach(f => {
      const currentPath = getLocalizedContentPath(f);
      routes.push({
        url: `${domain}${currentPath}`,
        lastModified: new Date(f.updatedAt),
        changeFrequency: 'weekly',
        priority: f.seo.priority || 0.9,
        alternates: {
          languages: Object.keys(alternates).length > 0 ? {
            ...alternates,
            'x-default': xDefault
          } : undefined
        }
      });
    });
  });

  // Integrations Pages (Legacy)
  integrations.forEach((integration) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${domain}/${locale}/integrations/${integration.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  // Glossary Pages (Legacy)
  locales.forEach((locale) => {
    routes.push({
      url: `${domain}/${locale}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });
  
  glossary.forEach((item) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${domain}/${locale}/glossary/${item.term}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return routes;
}

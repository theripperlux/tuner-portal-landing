import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'ar', 'zh', 'no', 'pt', 'ru', 'sv'],
  defaultLocale: 'en',
  pathnames: {
    '/features': {
      en: '/features',
      de: '/funktionen',
      fr: '/fonctionnalites',
      es: '/funciones',
      it: '/funzionalità',
      nl: '/functies',
      ar: '/features', // Fallback or translated depending on need
      zh: '/features',
      no: '/funksjoner',
      pt: '/recursos',
      ru: '/features',
      sv: '/funktioner'
    },
    '/features/[slug]': {
      en: '/features/[slug]',
      de: '/funktionen/[slug]',
      fr: '/fonctionnalites/[slug]',
      es: '/funciones/[slug]',
      it: '/funzionalità/[slug]',
      nl: '/functies/[slug]',
      ar: '/features/[slug]',
      zh: '/features/[slug]',
      no: '/funksjoner/[slug]',
      pt: '/recursos/[slug]',
      ru: '/features/[slug]',
      sv: '/funktioner/[slug]'
    },
    '/solutions': {
      en: '/solutions',
      de: '/loesungen',
      fr: '/solutions',
      es: '/soluciones',
      it: '/soluzioni',
      nl: '/oplossingen',
      ar: '/solutions',
      zh: '/solutions',
      no: '/losninger',
      pt: '/solucoes',
      ru: '/solutions',
      sv: '/losningar'
    },
    '/solutions/[slug]': {
      en: '/solutions/[slug]',
      de: '/loesungen/[slug]',
      fr: '/solutions/[slug]',
      es: '/soluciones/[slug]',
      it: '/soluzioni/[slug]',
      nl: '/oplossingen/[slug]',
      ar: '/solutions/[slug]',
      zh: '/solutions/[slug]',
      no: '/losninger/[slug]',
      pt: '/solucoes/[slug]',
      ru: '/solutions/[slug]',
      sv: '/losningar/[slug]'
    },
    '/login': '/login',
    '/register': '/register',
    '/admin': '/admin',
    '/dashboard': '/dashboard',
    '/terms': '/terms',
    '/privacy': '/privacy',
    '/forgot-password': '/forgot-password',
    '/reset-password': '/reset-password',
    '/demo': '/demo',
    '/start-ecu-tuning-business': '/start-ecu-tuning-business',
    '/reseller-management': '/reseller-management',
    '/ai-ecu-tuning': '/ai-ecu-tuning',
    '/tuning-file-service-software': '/tuning-file-service-software',
    '/setup-guide': '/setup-guide',
    '/winols-interceptor': '/winols-interceptor',
    '/pricing': '/pricing',
    '/': '/'
  }
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

import { UniversalContent } from '@/types/content';
import { isContentPublic } from '@/utils/contentUtils';

export const DOMAIN = 'https://tunerportal.com';

export function getLocalizedContentPath(content: UniversalContent): string {
  // Uses next-intl getPathname to map generic paths to localized paths based on locale
  let href: any;
  if (content.type === 'feature') {
    href = { pathname: '/features/[slug]', params: { slug: content.slug } };
  } else if (content.type === 'solution') {
    href = { pathname: '/solutions/[slug]', params: { slug: content.slug } };
  } else {
    // Fallback for unsupported types yet
    href = `/${content.type}s/${content.slug}`;
  }
  
  try {
    return getPathname({ href, locale: content.locale as any });
  } catch (e) {
    // Fallback if not configured in next-intl
    return `/${content.locale}/${content.type}s/${content.slug}`;
  }
}

export function getAbsoluteContentUrl(content: UniversalContent): string {
  const path = getLocalizedContentPath(content);
  return `${DOMAIN}${path}`;
}

export function getTranslationAlternates(translations: UniversalContent[]) {
  const alternates: Record<string, string> = {};
  let xDefault = '';
  
  // Filter out non-public and noIndex pages from hreflang cluster
  const validTranslations = translations.filter(t => isContentPublic(t) && !t.noIndex);
  
  validTranslations.forEach(t => {
    const url = getAbsoluteContentUrl(t);
    alternates[t.locale] = url;
    if (t.locale === 'en') xDefault = url;
  });

  if (!xDefault && validTranslations.length > 0) {
    xDefault = getAbsoluteContentUrl(validTranslations[0]);
  }
  
  return { alternates, xDefault };
}

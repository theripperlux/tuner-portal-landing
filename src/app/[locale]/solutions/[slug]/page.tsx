import { contentRepository } from '@/lib/api/LocalContentAdapter';
import { SolutionPayload, UniversalContent, ContentRelation } from '@/types/content';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/SiteNav';
import { SchemaOrg } from '@/components/SchemaOrg';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPathname } from '@/i18n/routing';
import { ModuleRenderer } from '@/components/ModuleRenderer';
import { isContentPublic } from '@/utils/contentUtils';
import { getTranslationAlternates, getLocalizedContentPath } from '@/i18n/routing';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export async function generateStaticParams() {
  const solutions = await contentRepository.getAllContent('solution');
  return solutions.map((solution) => ({
    slug: solution.slug,
    locale: solution.locale,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const solution = await contentRepository.getContentBySlug('solution', slug, locale);
  if (!solution || !isContentPublic(solution)) return {};

  const translations = await contentRepository.getTranslations(solution.translationGroupId);
  const { alternates, xDefault } = getTranslationAlternates(translations);

  const currentPath = getLocalizedContentPath(solution);
  const currentUrl = `https://tunerportal.com${currentPath}`;

  return {
    title: solution.seo.metaTitle,
    description: solution.seo.metaDescription,
    keywords: solution.seo.focusKeyword ? [solution.seo.focusKeyword, ...(solution.seo.secondaryKeywords || [])] : undefined,
    robots: solution.noIndex ? 'noindex, nofollow' : (solution.seo.robots || 'index, follow'),
    alternates: {
      canonical: solution.seo.canonicalOverride || currentUrl,
      languages: Object.keys(alternates).length > 0 ? {
        ...alternates,
        'x-default': xDefault,
      } : undefined,
    },
    openGraph: {
      title: solution.seo.ogTitle || solution.seo.metaTitle,
      description: solution.seo.ogDescription || solution.seo.metaDescription,
      images: solution.seo.ogImage ? [{ url: solution.seo.ogImage }] : undefined,
      type: solution.seo.ogType || 'website',
    }
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const solution = await contentRepository.getContentBySlug('solution', slug, locale);
  
  if (!solution || solution.status !== 'published' || solution.type !== 'solution') {
    notFound();
  }

  // Fetch relational data
  const relatedSolutionIds = solution.relations
    .filter((r: ContentRelation) => r.relationType === 'related' || r.relationType === 'integrates_with')
    .map((r: ContentRelation) => r.targetId);
    
  const relatedContent = await contentRepository.getRelatedContent(relatedSolutionIds);

  // Dynamically build Schema.org from actual modules
  const faqModule = (solution.payload as SolutionPayload).modules.find((m: any) => m._type === 'faq') as any;
  const faqSchema = faqModule?.questions || undefined;

  // Breadcrumbs data
  const breadcrumbItems = [
    { label: locale === 'de' ? 'Lösungen' : 'Solutions', href: `/${locale}/solutions` },
    { label: solution.title }
  ];

  return (
    <div className="bg-[#fafafa] dark:bg-[#08080a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors relative font-sans flex flex-col">
      <SchemaOrg 
        breadcrumbs={[
          { name: 'Home', url: `https://tunerportal.com/${locale}` },
          { name: locale === 'de' ? 'Lösungen' : 'Solutions', url: `https://tunerportal.com/${locale}/solutions` },
          { name: solution.title, url: `https://tunerportal.com/${locale}/solutions/${solution.slug}` }
        ]} 
        isSoftware={solution.seo.schemaTypes.includes('SoftwareApplication')}
        faq={faqSchema}
      />
      <SiteNav />
      
      <div className="container mx-auto px-6 lg:px-12 py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      {/* 
        ModuleRenderer iterates over all payload blocks (hero, benefits, etc.)
        and renders them sequentially. This removes hardcoding from the template.
      */}
      <main className="flex-grow">
        <ModuleRenderer modules={(solution.payload as SolutionPayload).modules} />
      </main>

      {/* Relational Sidebar Section - Rendered below main content or inside a grid if desired */}
      {relatedContent.length > 0 && (
        <section className="py-12 bg-white dark:bg-[#0a0a0c] border-t border-gray-200 dark:border-white/10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <h3 className="text-xl font-bold font-['Outfit'] mb-6">
              {locale === 'de' ? 'Verwandte Lösungen' : 'Related Solutions'}
            </h3>
            <div className="flex flex-wrap gap-4">
              {relatedContent.map((rel) => {
                const relPath = getPathname({ href: { pathname: '/solutions/[slug]', params: { slug: rel.slug } }, locale: rel.locale as any });
                return (
                  <Link 
                    key={rel.id} 
                    href={relPath}
                    className="inline-flex items-center gap-2 bg-gray-50 dark:bg-[#111115] hover:bg-gray-100 dark:hover:bg-[#1a1a20] text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-semibold border border-gray-200 dark:border-white/10 transition-colors"
                  >
                    {rel.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

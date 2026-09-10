import { getMdxContent, getAllMdxSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { SchemaOrg } from '@/components/SchemaOrg';

export async function generateStaticParams(props: any) {
  console.log('generateStaticParams props:', props);
  const locale = props?.params?.locale || 'de'; // fallback
  const slugs = getAllMdxSlugs('landingpages', locale);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const content = getMdxContent('landingpages', locale, slug);
  
  if (!content) return { title: 'Not Found' };

  return {
    title: content.frontmatter.title,
    description: content.frontmatter.description,
    openGraph: {
      title: content.frontmatter.title,
      description: content.frontmatter.description,
      type: 'article',
    },
    alternates: {
      canonical: content.frontmatter.canonicalUrl || `https://tunerportal.com/${locale}/lp/${slug}`,
    }
  };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const content = getMdxContent('landingpages', locale, slug);
  
  if (!content) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'SeoHomePage' });

  // Custom components for MDX (for a Linear/Vercel aesthetic)
  const components = {
    h1: (props: any) => <h1 className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-8 text-gray-900 dark:text-white leading-tight" {...props} />,
    h2: (props: any) => <h2 className="text-3xl font-bold font-['Outfit'] mt-16 mb-6 text-gray-900 dark:text-white" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-bold font-['Outfit'] mt-12 mb-4 text-gray-800 dark:text-gray-100" {...props} />,
    p: (props: any) => <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="space-y-3 mb-8" {...props} />,
    li: (props: any) => (
      <li className="flex items-start gap-3 text-lg text-gray-600 dark:text-gray-400">
        <CheckCircle2 className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
        <span>{props.children}</span>
      </li>
    ),
    // FAQ Component
    FAQ: ({ question, answer }: { question: string, answer: string }) => (
      <details className="group bg-gray-50 dark:bg-[#111115] border border-gray-200 dark:border-white/10 rounded-2xl cursor-pointer mb-4">
        <summary className="flex items-center justify-between font-bold p-6 text-lg list-none">
          {question}
          <span className="transition group-open:rotate-180">
            <svg fill="none" height="24" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
          </span>
        </summary>
        <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-lg">
          {answer}
        </div>
      </details>
    )
  };

  return (
    <div className="bg-[#fafafa] dark:bg-[#08080a] min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-red-500/30">
      <SiteNav />
      <SchemaOrg />

      <main className="pt-32 pb-24">
        <article className="max-w-[800px] mx-auto px-6 lg:px-12">
          
          {/* Hero of the Article */}
          <header className="mb-16 text-center border-b border-gray-200 dark:border-white/10 pb-12">
            <h1 className="text-5xl md:text-6xl font-bold font-['Outfit'] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-800">
              {content.frontmatter.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              {content.frontmatter.description}
            </p>
            <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-[1.02] shadow-lg shadow-red-500/30">
              {t('btnPrimary')} <ArrowRight className="w-5 h-5" />
            </Link>
          </header>

          {/* MDX Content rendering */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-blue">
            <MDXRemote source={content.content} components={components} />
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 p-12 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-3xl text-center relative overflow-hidden">
             <h2 className="text-3xl font-bold font-['Outfit'] mb-6 text-red-900 dark:text-red-100">Bereit für dein eigenes AI Tuning Portal?</h2>
             <p className="text-lg text-red-700 dark:text-red-300 mb-10">Kostenlos starten. Keine Kreditkarte. In 5 Minuten online.</p>
             <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-[1.02] shadow-lg">
                Jetzt kostenlos starten <ArrowRight className="w-5 h-5" />
             </Link>
          </div>

        </article>
      </main>
    </div>
  );
}

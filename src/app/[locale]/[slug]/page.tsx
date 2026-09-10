import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getMdxContent } from '@/lib/mdx';
import { MdxRenderer } from '@/components/MdxRenderer';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getMdxContent('landingpages', locale, slug);
  
  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: post.frontmatter.canonicalUrl || `https://tunerportal.com/${locale}/${slug}`
    }
  };
}

export default async function MdxLandingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getMdxContent('landingpages', locale, slug);
  const t = await getTranslations('LandingPage');

  if (!post) {
    notFound();
  }

  // Generate FAQ Schema if exists in frontmatter
  const faqSchema = post.frontmatter.faq ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.frontmatter.faq.map((f: any) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors selection:bg-red-400 selection:text-black">
      <SiteNav />

      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* HERO SECTION FOR MDX LANDING PAGES */}
      <div className="pt-32 pb-24 border-b border-black/5 dark:border-white/[0.05] bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="font-['Archivo'] font-black text-5xl md:text-7xl tracking-tighter text-black dark:text-white mb-6 leading-[1.1]">
            {post.frontmatter.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
            {post.frontmatter.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all shadow-xl">
              {t('startFreeTrial')}
            </Link>
            <Link href="#content" className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 px-8 py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all">
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </div>

      {/* MDX CONTENT */}
      <div id="content" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <MdxRenderer source={post.content} />

          {/* BOTTOM CTA */}
          <div className="mt-20 p-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#111] dark:to-[#222] rounded-3xl border border-black/5 dark:border-white/[0.05] shadow-2xl text-center">
            <h3 className="font-['Archivo'] font-black text-3xl text-black dark:text-white mb-4">{t('ctaTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{t('ctaDesc')}</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-red-500 dark:bg-red-400 hover:bg-red-500 dark:hover:bg-red-300 text-white dark:text-black px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg">
              {t('ctaBtn')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

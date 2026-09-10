import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getMdxContent } from '@/lib/mdx';
import { MdxRenderer } from '@/components/MdxRenderer';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getMdxContent('case-studies', locale, slug);
  
  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: post.frontmatter.canonicalUrl || `https://tunerportal.com/${locale}/case-studies/${slug}`
    }
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getMdxContent('case-studies', locale, slug);
  const t = await getTranslations('ContentDetail');

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors selection:bg-red-400 selection:text-black">
      <SiteNav />

      {/* CASE STUDY HERO */}
      <div className="pt-32 pb-20 border-b border-black/5 dark:border-white/[0.05] bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link href="/case-studies" className="text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-6 inline-block">
            {t('backToCaseStudies')}
          </Link>
          <h1 className="font-['Archivo'] font-black text-4xl md:text-6xl tracking-tighter text-black dark:text-white mb-6">
            {post.frontmatter.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {post.frontmatter.description}
          </p>
        </div>
      </div>

      {/* MDX CONTENT */}
      <div className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <MdxRenderer source={post.content} />
        </div>
      </div>

    </div>
  );
}

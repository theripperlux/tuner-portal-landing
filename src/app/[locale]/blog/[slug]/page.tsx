import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getMdxContent } from '@/lib/mdx';
import { MdxRenderer } from '@/components/MdxRenderer';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getMdxContent('blog', locale, slug);
  
  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: post.frontmatter.canonicalUrl || `https://tunerportal.com/${locale}/blog/${slug}`
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = getMdxContent('blog', locale, slug);
  const t = await getTranslations('ContentDetail');

  if (!post) {
    notFound();
  }

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.frontmatter.title,
    "description": post.frontmatter.description,
    "datePublished": post.frontmatter.date || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "TunerPortal"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors selection:bg-red-400 selection:text-black">
      <SiteNav />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* ARTICLE HERO */}
      <div className="pt-32 pb-20 border-b border-black/5 dark:border-white/[0.05] bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blog" className="text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-6 inline-block">
            {t('backToBlog')}
          </Link>
          
          {post.frontmatter.category && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-red-400/10 text-red-500 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20 dark:border-red-400/20">
                <Tag className="w-3 h-3" /> {post.frontmatter.category}
              </span>
            </div>
          )}

          <h1 className="font-['Archivo'] font-black text-4xl md:text-6xl tracking-tighter text-black dark:text-white mb-6 leading-[1.1]">
            {post.frontmatter.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {post.frontmatter.description}
          </p>

          <div className="flex items-center gap-6 text-sm font-mono text-gray-500 border-t border-black/5 dark:border-white/[0.05] pt-8">
            {post.frontmatter.date && (
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.frontmatter.date}</span>
            )}
            {post.frontmatter.readTime && (
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.frontmatter.readTime}</span>
            )}
          </div>
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

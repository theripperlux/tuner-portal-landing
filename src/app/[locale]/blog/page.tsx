import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag, Calendar } from 'lucide-react';
import { Metadata } from 'next';
import { getAllMdxContent } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Blog & Resources | TunerPortal',
  description: 'Learn how to scale your tuning business with AI, automation, and expert industry insights.'
};

export default async function BlogHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('BlogPage');
  // Read all MDX blog posts
  const posts = getAllMdxContent('blog', locale);
  const categories = [t('cat1'), t('cat2'), t('cat3'), t('cat4'), t('cat5'), t('cat6'), t('cat7')];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors">
      <SiteNav />

      {/* HEADER */}
      <div className="pt-32 pb-16 border-b border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 text-black dark:text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 mb-6">
            <BookOpen className="w-4 h-4" /> {t('badge')}
          </span>
          <h1 className="font-['Archivo'] font-black text-4xl md:text-6xl uppercase tracking-tighter text-black dark:text-white mb-6">
            {t('heroTitle')} <span className="text-red-500 dark:text-red-400">{t('heroHighlight')}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('heroDesc')}
          </p>
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="border-b border-black/5 dark:border-white/[0.05] bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-2 md:justify-center overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button key={i} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${i === 0 ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-transparent border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* BLOG GRID */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/[0.05] rounded-2xl overflow-hidden hover:border-red-500/50 dark:hover:border-red-400/50 transition-all shadow-sm dark:shadow-none hover:shadow-xl">
              <div className="h-48 bg-gray-100 dark:bg-[#111] relative overflow-hidden border-b border-black/5 dark:border-white/[0.05]">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {post.frontmatter.category && (
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5 border border-white/10">
                    <Tag className="w-3 h-3" /> {post.frontmatter.category}
                  </div>
                )}
                <div className="w-full h-full bg-gradient-to-tr from-red-500/20 to-red-600/20 dark:from-red-400/20 dark:to-red-600/20 transition-transform duration-500" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                  {post.frontmatter.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.frontmatter.date}</span>}
                  {post.frontmatter.readTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.frontmatter.readTime}</span>}
                </div>
                <h3 className="text-xl font-bold font-['Archivo'] text-black dark:text-white mb-3 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-tight">
                  {post.frontmatter.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1">
                  {post.frontmatter.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-bold text-black dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors mt-auto">
                  {t('readArticle')} <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              {t('emptyState')}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

import { getTranslations } from 'next-intl/server';
import { glossary } from '@/data/glossary';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return glossary.map((item) => ({
    term: item.term,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const item = glossary.find((i) => i.term === term);
  if (!item) return {};

  return {
    title: `${item.seoTitle} | TunerPortal Glossary`,
    description: item.description,
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string, locale: string }> }) {
  const { term, locale } = await params;
  const item = glossary.find((i) => i.term === term);
  const t = await getTranslations('GlossaryTermPage');

  if (!item) {
    notFound();
  }

  return (
    <div className="bg-[#fafafa] dark:bg-[#08080a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors relative font-sans">
      <SiteNav />
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <Link href="/glossary" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" /> {t('backToGlossary')}
          </Link>
          <h1 className="font-['Outfit'] font-bold text-4xl md:text-5xl mb-8 leading-tight">
            {item.title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {item.description}
            </p>
            <div className="my-10 h-px w-full bg-gray-200 dark:bg-white/10" />
            <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
              {item.content}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-red-500 text-white text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl font-bold font-['Outfit'] mb-6">{t('ctaTitle')}</h2>
          <p className="text-red-100 mb-8 text-lg">
            {t('ctaDesc')}
          </p>
          <Link href="/register" className="inline-flex bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            {t('ctaBtn')}
          </Link>
        </div>
      </section>
    </div>
  );
}

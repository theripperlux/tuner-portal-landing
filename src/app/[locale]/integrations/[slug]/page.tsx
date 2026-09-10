import { getTranslations } from 'next-intl/server';
import { integrations } from '@/data/integrations';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export async function generateStaticParams() {
  return integrations.map((integration) => ({
    slug: integration.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const integration = integrations.find((i) => i.slug === slug);
  if (!integration) return {};

  return {
    title: `${integration.title} | TunerPortal`,
    description: integration.description,
  };
}

export default async function IntegrationPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const integration = integrations.find((i) => i.slug === slug);
  const t = await getTranslations('IntegrationPage');

  if (!integration) {
    notFound();
  }

  return (
    <div className="bg-[#fafafa] dark:bg-[#08080a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors relative font-sans">
      <SiteNav />
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {t('badge')}
          </div>
          <h1 className="font-['Outfit'] font-bold text-5xl md:text-6xl mb-8">
            {integration.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {integration.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
              {t('connectNow', { name: integration.name })}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-[#0a0a0c]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold font-['Outfit'] mb-12 text-center">{t('whyIntegrate', { name: integration.name })}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integration.features.map((feature, i) => (
              <div key={i} className="p-8 bg-gray-50 dark:bg-[#111115] rounded-3xl border border-gray-200 dark:border-white/10">
                <CheckCircle2 className="w-8 h-8 text-red-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {t('featureDesc', { name: integration.name })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { getTranslations } from 'next-intl/server';
import { glossary } from '@/data/glossary';
import { SiteNav } from '@/components/SiteNav';
import Link from 'next/link';

export const metadata = {
  title: 'Chiptuning Glossary & Wiki | TunerPortal',
  description: 'The ultimate dictionary and wiki for the chiptuning industry. Learn about ECU tuning terms like DTC, CVN, Checksum, and more.',
};

export default async function GlossaryHubPage() {
  const t = await getTranslations('GlossaryPage');
  return (
    <div className="bg-[#fafafa] dark:bg-[#08080a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors relative font-sans">
      <SiteNav />
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-gray-200 dark:border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <h1 className="font-['Outfit'] font-bold text-5xl md:text-6xl mb-8">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-[#0a0a0c]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {glossary.map((item) => (
              <Link key={item.term} href={`/glossary/${item.term}`} className="block p-8 bg-gray-50 dark:bg-[#111115] hover:bg-gray-100 dark:hover:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-3 text-red-600 dark:text-red-400">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

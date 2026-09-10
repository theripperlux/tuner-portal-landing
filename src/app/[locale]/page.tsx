import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Bot, LayoutTemplate, UploadCloud, Users, Zap, Search, CreditCard, ShieldCheck, XCircle, Globe } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import LiveChat from '@/components/LiveChat';
import { SchemaOrg } from '@/components/SchemaOrg';
import { Reveal } from '@/components/Reveal';
import { FaqAccordion } from '@/components/FaqAccordion';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SeoHomePage' });
  
  return {
    title: t('seoTitle'),
    description: t('seoDesc'),
    openGraph: {
      title: t('seoTitle'),
      description: t('seoDesc'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('seoTitle'),
      description: t('seoDesc'),
    }
  };
}

export default function Home() {
  const t = useTranslations('SeoHomePage');

  // JSON-LD Schema (FAQ & WebPage)
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": Array.from({length: 19}, (_, i) => i + 1).map(i => ({
          "@type": "Question",
          "name": t(`faq${i}Q` as any),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t(`faq${i}A` as any)
          }
        }))
      },
      {
        "@type": "WebPage",
        "name": t('seoTitle'),
        "description": t('seoDesc')
      }
    ]
  };

  return (
    <div className="bg-[#fafafa] dark:bg-[#08080a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors relative font-sans selection:bg-red-500/30">
      <SchemaOrg />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <SiteNav />

      {/* HERO SECTION - LINEAR/VERCEL AESTHETIC */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden relative border-b border-gray-200 dark:border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent dark:from-red-900/10 dark:to-transparent pointer-events-none" />

        {/* Ambient drifting glow */}
        <div className="drift-slow absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-500/10 dark:bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h1 className="hero-in hero-in-1 font-['Outfit'] font-bold text-5xl md:text-6xl lg:text-[80px] leading-[1.05] tracking-tight mb-8 mx-auto max-w-4xl">
            {t('heroTitle')} <br />
            <span className="text-red-600 dark:text-red-500 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-800">
              {t('heroHighlight')}
            </span>
          </h1>

          <p className="hero-in hero-in-2 text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            {t('heroSubtitle')}
          </p>

          <div className="hero-in hero-in-3 flex flex-col sm:flex-row w-full sm:w-auto justify-center gap-4 mb-16">
            <Link href="/register" className="cta-glow inline-flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-transform hover:scale-[1.02]">
              {t('btnPrimary')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="inline-flex justify-center items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-white/10 backdrop-blur-sm">
              {t('btnSecondary')}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero-in hero-in-4 flex flex-wrap justify-center items-center gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t('trust1')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><CheckCircle2 className="w-4 h-4 text-green-500" /> {t('trust2')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><Bot className="w-4 h-4 text-red-500" /> {t('trust3')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><LayoutTemplate className="w-4 h-4 text-red-800" /> {t('trust4')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><Zap className="w-4 h-4 text-yellow-500" /> {t('trust5')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><ShieldCheck className="w-4 h-4 text-gray-500" /> {t('trust6')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><UploadCloud className="w-4 h-4 text-red-400" /> {t('trust7')}</span>
            <span className="flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 shadow-sm"><Globe className="w-4 h-4 text-red-800" /> {t('trust8')}</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-24 bg-[#0a0a0c]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <Reveal className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-red-500/10">
            {/* Minimal browser chrome */}
            <div className="h-10 bg-[#111115] border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-[11px] text-white/30 font-mono">admin.yourportal.com/file-services</span>
            </div>
            <div className="w-full relative">
              <Image
                src="/admin_fileservice_v1.png"
                alt="TunerPortal admin dashboard showing live file service requests, statuses, and workflow"
                width={2538}
                height={1112}
                className="w-full h-auto"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 bg-white dark:bg-[#050505] border-b border-gray-200 dark:border-white/5 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <Reveal as="h2" className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-24">{t('howItWorksTitle')}</Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {[
              { id: '1', icon: <CheckCircle2 className="w-8 h-8 text-green-600" />, title: t('step1Title'), desc: t('step1Desc') },
              { id: '2', icon: <LayoutTemplate className="w-8 h-8 text-red-600" />, title: t('step2Title'), desc: t('step2Desc') },
              { id: '3', icon: <Zap className="w-8 h-8 text-yellow-600" />, title: t('step3Title'), desc: t('step3Desc') },
              { id: '4', icon: <UploadCloud className="w-8 h-8 text-red-800" />, title: t('step4Title'), desc: t('step4Desc') },
              { id: '5', icon: <Bot className="w-8 h-8 text-red-400" />, title: t('step5Title'), desc: t('step5Desc') },
              { id: '6', icon: <Globe className="w-8 h-8 text-red-800" />, title: t('step6Title'), desc: t('step6Desc') },
              { id: '7', icon: <CreditCard className="w-8 h-8 text-green-500" />, title: t('step7Title'), desc: t('step7Desc') },
            ].map((step, i) => (
              <Reveal key={step.id} delay={i * 70} className="relative flex flex-col items-center group">
                <div className="w-20 h-20 bg-gray-50 dark:bg-[#111115] border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm z-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:border-red-300 dark:group-hover:border-red-500/40">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-['Outfit']">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-full font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20">
              {t('btnPrimary')} <ArrowRight className="w-5 h-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* WHY TUNERPORTAL? */}
      <section className="py-32 bg-gray-50 dark:bg-[#0a0a0c] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <Reveal as="h2" className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-6">{t('whyTitle')}</Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Bot className="w-6 h-6" />, title: t('why1Title'), desc: t('why1Desc') },
              { icon: <LayoutTemplate className="w-6 h-6" />, title: t('why2Title'), desc: t('why2Desc') },
              { icon: <Search className="w-6 h-6" />, title: t('why3Title'), desc: t('why3Desc') },
              { icon: <Users className="w-6 h-6" />, title: t('why4Title'), desc: t('why4Desc') },
              { icon: <UploadCloud className="w-6 h-6" />, title: t('why5Title'), desc: t('why5Desc') },
              { icon: <CreditCard className="w-6 h-6" />, title: t('why6Title'), desc: t('why6Desc') },
              { icon: <Users className="w-6 h-6" />, title: t('why7Title'), desc: t('why7Desc') },
              { icon: <ShieldCheck className="w-6 h-6" />, title: t('why8Title'), desc: t('why8Desc') },
              { icon: <Globe className="w-6 h-6" />, title: t('why9Title'), desc: t('why9Desc') },
            ].map((feature, i) => (
              <Reveal key={i} delay={(i % 3) * 90} className="bg-white dark:bg-[#111115] p-10 rounded-3xl border border-gray-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1.5 hover:border-red-200 dark:hover:border-red-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-['Outfit']">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WITH VS WITHOUT */}
      <section className="py-32 bg-white dark:bg-[#050505] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-24">
            <Reveal as="h2" className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-6">{t('compareTitle')}</Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without — muted/neutral, reads as the old, unremarkable way */}
            <Reveal className="p-10 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02]">
              <h3 className="text-3xl font-bold mb-8 text-gray-500 dark:text-gray-400 font-['Outfit']">{t('withoutTitle')}</h3>
              <ul className="space-y-6 text-lg">
                {[1,2,3,4,5,6].map(i => (
                  <li key={i} className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <XCircle className="w-6 h-6 text-gray-400 dark:text-gray-500 shrink-0" />
                    {t(`without${i}` as any)}
                  </li>
                ))}
              </ul>
            </Reveal>
            {/* With — the one card that gets the full brand treatment, so it reads as the answer */}
            <Reveal delay={120} className="p-10 rounded-3xl border-2 border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-900/10 relative overflow-hidden shadow-lg shadow-red-500/10">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Bot className="w-32 h-32 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold mb-8 text-red-600 dark:text-red-400 font-['Outfit']">{t('withTitle')}</h3>
              <ul className="space-y-6 text-lg relative z-10">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <li key={i} className="flex items-center gap-4 text-gray-900 dark:text-white font-medium">
                    <CheckCircle2 className="w-6 h-6 text-red-500 shrink-0" />
                    {t(`with${i}` as any)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY AI? */}
      <section className="py-32 bg-gray-50 dark:bg-[#0a0a0c] border-b border-gray-200 dark:border-white/5">
        <Reveal as="div" className="max-w-[1000px] mx-auto px-6 lg:px-12 text-center">
          <Bot className="w-16 h-16 text-red-600 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-12">{t('whyAiTitle')}</h2>
          <div className="space-y-8 text-xl text-gray-600 dark:text-gray-400 leading-relaxed text-left md:text-center">
            <p>{t('whyAiDesc1')}</p>
            <p>{t('whyAiDesc2')}</p>
            <p className="font-bold text-gray-900 dark:text-white">{t('whyAiDesc3')}</p>
          </div>
        </Reveal>
      </section>

      {/* SUCCESS STORIES */}
      <section className="py-32 bg-white dark:bg-[#050505] border-b border-gray-200 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <Reveal as="h2" className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-16 text-center">{t('successTitle')}</Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <Reveal key={i} delay={i * 90} className="bg-gray-50 dark:bg-[#111115] p-10 rounded-3xl border border-gray-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-300 italic">"{t(`success${i}` as any)}"</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / SECURITY */}
      <section className="py-24 bg-gray-50 dark:bg-[#0a0a0c] border-b border-gray-200 dark:border-white/5">
         <Reveal as="div" className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl font-bold font-['Outfit'] mb-12">{t('securityTitle')}</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="flex items-center gap-3 bg-white dark:bg-[#111115] px-6 py-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  <span className="font-medium">{t(`security${i}` as any)}</span>
                </div>
              ))}
            </div>
         </Reveal>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-white dark:bg-[#050505]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <Reveal as="h2" className="text-4xl md:text-5xl font-bold font-['Outfit'] mb-12 text-center">{t('faqTitle')}</Reveal>
          <FaqAccordion
            columns={2}
            items={Array.from({length: 19}, (_, i) => i + 1).map((i) => ({
              q: t(`faq${i}Q` as any),
              a: t(`faq${i}A` as any),
            }))}
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-br from-red-600 to-red-800 text-white relative overflow-hidden text-center">
        <div className="drift-slow absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />
        <Reveal as="div" className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl font-bold mb-8 font-['Outfit']">{t('finalCtaTitle')}</h2>
          <p className="text-2xl text-red-100 mb-12">{t('finalCtaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-50 text-red-600 px-10 py-5 rounded-full font-bold text-lg transition-transform hover:scale-[1.02] shadow-xl">
              {t('btnPrimary')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="inline-flex justify-center items-center gap-2 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-[1.02]">
              {t('btnSecondary')}
            </Link>
          </div>
        </Reveal>
      </section>

      <LiveChat />
    </div>
  );
}

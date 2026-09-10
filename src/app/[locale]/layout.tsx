import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { GlobalConversionComponents } from '@/components/GlobalConversionComponents';
import { Footer } from '@/components/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getMessages({ locale });
  const index = t.Index as Record<string, string>;
  const title = `Tunerportal | ${index?.heroTitlePart1 || 'Start Your White-Label Portal'} ${index?.heroTitlePart2 || ''}`;
  const desc = index?.subtitle || 'Launch your own powerful white-label AI Chiptuning platform today. Zero setup costs. Automated ECU file processing, DTC removal, and integrated B2B shop. Scale your tuning business effortlessly.';

  return {
    metadataBase: new URL('https://tunerportal.com'),
    title: title,
    description: desc,
    keywords: 'Chiptuning Portal, White-label Tuning Software, ECU Tuning SaaS, Tuning File Service, DTC Removal, AutoTuner, Kess3, WinOLS, EVC',
    openGraph: {
      title: title,
      description: desc,
      url: 'https://tunerportal.com',
      siteName: 'TunerPortal',
      images: [
        {
          url: 'https://tunerportal.com/opengraph-image.png', 
          width: 1200,
          height: 630,
          alt: 'TunerPortal AI Chiptuning',
        },
      ],
      locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
      type: 'website',
    },
    icons: {
      icon: '/logo.png',
      shortcut: '/logo.png',
      apple: '/logo.png',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const allowedLocales = ['en', 'de', 'fr', 'es', 'it', 'nl', 'ar', 'zh', 'no', 'pt', 'ru', 'sv'];
  if (!allowedLocales.includes(locale)) notFound();

  const messages = await getMessages();

  // Global Schema.org Setup
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://tunerportal.com/#organization",
        "name": "TunerPortal",
        "url": "https://tunerportal.com",
        "logo": "https://tunerportal.com/logo.png",
        "description": "Create Your Own AI Tuning Portal for Free. White Label ECU File Service Software."
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://tunerportal.com/#software",
        "name": "TunerPortal AI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        }
      }
    ]
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Footer />
              <GlobalConversionComponents />
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
        
        {/* Global Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
        
        {/* Consent Mode v2 Default Settings */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'analytics_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted'
            });
          `}
        </Script>
        
        {/* Official Next.js GA Component (Handles Router Navigation Automatically) */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'} />
      </body>
    </html>
  );
}

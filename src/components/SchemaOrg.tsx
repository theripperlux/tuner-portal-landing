import React from 'react';

type SchemaOrgProps = {
  faq?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
  isSoftware?: boolean;
};

export function SchemaOrg({ faq, breadcrumbs, isSoftware = true }: SchemaOrgProps) {
  const schema: any = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://tunerportal.com/#organization",
        "name": "TunerPortal",
        "url": "https://tunerportal.com",
        "logo": "https://tunerportal.com/logo.png",
        "sameAs": ["https://tunerportal.com"]
      },
      {
        "@type": "WebSite",
        "@id": "https://tunerportal.com/#website",
        "name": "TunerPortal",
        "url": "https://tunerportal.com",
        "publisher": { "@id": "https://tunerportal.com/#organization" }
      }
    ]
  };

  if (isSoftware) {
    schema["@graph"].push({
      "@type": "SoftwareApplication",
      "@id": "https://tunerportal.com/#software",
      "name": "TunerPortal",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "EUR"
      },
      "description": "The world's leading White-Label ECU Tuning Portal Software for B2B Chiptuning businesses."
    });
  }

  // Always emit WebPage for features
  schema["@graph"].push({
    "@type": "WebPage",
    "@id": "https://tunerportal.com/#webpage",
    "url": typeof window !== 'undefined' ? window.location.href : "https://tunerportal.com",
    "isPartOf": {
      "@id": "https://tunerportal.com/#website"
    },
    "about": isSoftware ? { "@id": "https://tunerportal.com/#software" } : undefined
  });

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema["@graph"].push({
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((b, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": b.name,
        "item": b.url
      }))
    });
  }

  if (faq && faq.length > 0) {
    schema["@graph"].push({
      "@type": "FAQPage",
      "mainEntity": faq.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

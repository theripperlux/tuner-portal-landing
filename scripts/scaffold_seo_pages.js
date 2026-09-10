const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'src', 'content', 'de');
const lpDir = path.join(contentDir, 'landingpages');
const blogDir = path.join(contentDir, 'blog');

// Create directories if they don't exist
[lpDir, blogDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const landingPages = [
  { slug: "ai-tuning-portal", title: "Create Your Own AI Tuning Portal for Free", keyword: "AI Tuning Portal" },
  { slug: "free-ai-tuning-portal", title: "Free AI Tuning Portal: Automate Your Business", keyword: "Free AI Tuning Portal" },
  { slug: "create-ai-tuning-portal", title: "How to Create an AI Tuning Portal in 5 Minutes", keyword: "Create AI Tuning Portal" },
  { slug: "ecu-file-service", title: "The Ultimate ECU File Service Platform", keyword: "ECU File Service" },
  { slug: "ai-ecu-file-service", title: "Automate with an AI ECU File Service", keyword: "AI ECU File Service" },
  { slug: "tuning-file-management", title: "Professional Tuning File Management", keyword: "Tuning File Management" },
  { slug: "white-label-tuning-portal", title: "Start Your White Label Tuning Portal", keyword: "White Label Tuning Portal" },
  { slug: "chiptuning-software", title: "Cloud-Based Chiptuning Software", keyword: "Chiptuning Software" },
  { slug: "tuning-business-software", title: "Grow with Tuning Business Software", keyword: "Tuning Business Software" },
  { slug: "ecu-file-management", title: "Secure ECU File Management System", keyword: "ECU File Management" },
  { slug: "online-tuning-portal", title: "Launch Your Online Tuning Portal", keyword: "Online Tuning Portal" },
  { slug: "winols-integration", title: "Seamless WinOLS Integration for Tuners", keyword: "WinOLS Integration" },
  { slug: "cloud-tuning-platform", title: "Secure Cloud Tuning Platform", keyword: "Cloud Tuning Platform" },
  { slug: "reseller-management", title: "Reseller Management for Master Tuners", keyword: "Reseller Management" },
  { slug: "ai-chat-for-tuners", title: "AI Chat Assistant for Tuning Support", keyword: "AI Chat for Tuners" },
  { slug: "start-a-tuning-business", title: "How to Start a Tuning Business", keyword: "Start a Tuning Business" },
  { slug: "create-your-own-tuning-portal", title: "Create Your Own Tuning Portal", keyword: "Create Your Own Tuning Portal" },
  { slug: "file-service-platform", title: "The Modern File Service Platform", keyword: "File Service Platform" },
  { slug: "online-ecu-file-service", title: "Online ECU File Service Automation", keyword: "Online ECU File Service" },
  { slug: "tuning-file-platform", title: "B2B Tuning File Platform", keyword: "Tuning File Platform" }
];

const blogPosts = [
  "How to Start a Tuning File Service",
  "AI for ECU Tuning",
  "Best AI Tuning Software",
  "White Label Tuning Portal Guide",
  "How to Sell ECU Files Online",
  "WinOLS Automation Guide",
  "Cloud ECU File Management",
  "Future of AI in Chiptuning",
  "How to Build a Tuning Business",
  "Benefits of AI for Tuners",
  "ECU File Workflow",
  "Customer Management for Tuners",
  "How to Automate File Services",
  "Best Chiptuning Business Ideas",
  "Digital Transformation for Tuners",
  "Scale Your File Service",
  "Reseller Strategies for Master Tuners",
  "B2B Pricing for ECU Files",
  "Security in ECU Tuning",
  "API Integrations for Tuners",
  "Marketing Your Tuning Portal",
  "Payment Gateways for File Services",
  "Automated Invoicing for Tuners",
  "Customer Retention in Chiptuning",
  "Reducing Support Time with AI",
  "Tuning File Distribution",
  "Custom Domains for Tuners",
  "Branding Your File Service",
  "ECU Hardware vs Software Solutions",
  "Global File Service Expansion"
];

function generateContent(title, keyword, type) {
  return `---
title: "${title}"
description: "Erfahre alles über ${keyword}. Erstelle dein eigenes AI Tuning Portal in Minuten und automatisiere dein Business."
---

Hier entsteht der detaillierte Fachartikel zum Thema **${keyword}**.

## Einführung in ${keyword}

[PLATZHALTER: Strukturierter Text über ${keyword} wird in Priorität 3 eingefügt.]

## Die Vorteile von ${keyword}

- Vollständige Automatisierung
- Zeitersparnis durch AI
- White-Label Integration

## So integrierst du ${keyword} in deinen Workflow

[PLATZHALTER: Detaillierte Anleitung.]

---

<FAQ question="Was ist ${keyword}?" answer="${keyword} ist ein essenzieller Bestandteil moderner Tuning-Unternehmen." />
<FAQ question="Wie starte ich kostenlos?" answer="Du kannst dein AI Tuning Portal jederzeit ohne Kreditkarte starten." />
`;
}

// Generate Landing Pages
landingPages.forEach(lp => {
  const filePath = path.join(lpDir, `${lp.slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, generateContent(lp.title, lp.keyword, 'lp'));
  }
});

// Generate Blogs
blogPosts.forEach(title => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filePath = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, generateContent(title, title, 'blog'));
  }
});

console.log(`Successfully scaffolded ${landingPages.length} Landing Pages and ${blogPosts.length} Blog Posts.`);

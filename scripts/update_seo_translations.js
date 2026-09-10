const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'messages');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const newHomePage = {
  seoTitle: "Create Your Own AI Tuning Portal for Free | White Label ECU File Service",
  seoDesc: "Erstelle innerhalb weniger Minuten dein eigenes AI-gestütztes Tuning-Portal. Verwalte Kunden, automatisiere ECU-Dateianfragen, akzeptiere Zahlungen und baue dein eigenes Tuning-Business auf – komplett kostenlos zum Start.",
  heroTitle: "Create Your Own",
  heroHighlight: "AI Tuning Portal for Free",
  heroSubtitle: "Erstelle innerhalb weniger Minuten dein eigenes AI-gestütztes Tuning-Portal. Verwalte Kunden, automatisiere ECU-Dateianfragen, akzeptiere Zahlungen, arbeite mit Resellern zusammen und baue dein eigenes Tuning-Business auf – komplett kostenlos zum Start.",
  btnPrimary: "Kostenloses Portal erstellen",
  btnSecondary: "Live-Demo ansehen",
  
  trust1: "Kostenlos starten",
  trust2: "Keine Kreditkarte erforderlich",
  trust3: "AI Powered",
  trust4: "White Label",
  trust5: "In 5 Minuten eingerichtet",
  trust6: "DSGVO-konform",
  trust7: "Cloud-basiert",
  trust8: "Weltweit verfügbar",

  howItWorksTitle: "So funktioniert es",
  step1Title: "1. Kostenlos registrieren",
  step1Desc: "In wenigen Sekunden Account anlegen.",
  step2Title: "2. Eigenes Portal erstellen",
  step2Desc: "Deine Tuning-Firma, deine Umgebung.",
  step3Title: "3. Branding hochladen",
  step3Desc: "Logo und Farben als White-Label anpassen.",
  step4Title: "4. Kunden laden ECU-Dateien hoch",
  step4Desc: "Deine Kunden nutzen dein Portal für Uploads.",
  step5Title: "5. AI unterstützt bei der Bearbeitung",
  step5Desc: "Automatische Dateierkennung und Voranalyse.",
  step6Title: "6. Dateien ausliefern",
  step6Desc: "Rückversand sicher und automatisiert über die Cloud.",
  step7Title: "7. Umsatz steigern",
  step7Desc: "Zahlungsintegration rechnet automatisch ab.",

  whyTitle: "Warum TunerPortal?",
  why1Title: "Eigenes AI Tuning Portal",
  why1Desc: "Baue dein eigenes Portal auf, komplett automatisiert.",
  why2Title: "White Label",
  why2Desc: "Nutze dein eigenes Logo, Farben und Branding.",
  why3Title: "AI Customer Assistant",
  why3Desc: "Die AI beantwortet Kundenanfragen automatisch.",
  why4Title: "Kundenverwaltung",
  why4Desc: "Alle Kunden an einem Ort.",
  why5Title: "ECU-Dateiverwaltung",
  why5Desc: "Einfaches Hochladen, Verwalten und Bearbeiten.",
  why6Title: "Zahlungsabwicklung",
  why6Desc: "Direkt integriert. Keine manuellen Rechnungen.",
  why7Title: "Reseller-System",
  why7Desc: "Unbegrenzte Reseller verwalten.",
  why8Title: "Dashboard",
  why8Desc: "Alle Bestellungen und Umsätze im Blick.",
  why9Title: "Cloud",
  why9Desc: "Von überall erreichbar. Keine lokale Software.",

  compareTitle: "Der Vergleich",
  withoutTitle: "Ohne TunerPortal",
  without1: "WhatsApp",
  without2: "Excel",
  without3: "E-Mails",
  without4: "Manuelle Rechnungen",
  without5: "Chaos",
  without6: "Zeitverlust",
  
  withTitle: "Mit TunerPortal",
  with1: "AI",
  with2: "Automatisierung",
  with3: "Kundenportal",
  with4: "Dashboard",
  with5: "Zahlungsintegration",
  with6: "Reseller",
  with7: "Schneller arbeiten",
  with8: "Mehr Umsatz",

  successTitle: "Erfolgsgeschichten",
  success1: "Seit wir TunerPortal nutzen, sparen wir täglich mehrere Stunden.",
  success2: "Unsere Bestellungen haben sich verdoppelt.",
  success3: "Unsere Kunden lieben das Portal.",

  whyAiTitle: "Warum AI die Zukunft des Chiptunings ist",
  whyAiDesc1: "AI ist die Zukunft des Chiptunings. Sie spart dir als Tuner wertvolle Stunden bei der Identifizierung und Kategorisierung von ECU-Dateien.",
  whyAiDesc2: "Sie unterstützt deine Kunden rund um die Uhr, beantwortet Standardfragen und automatisiert 80% deiner Geschäftsprozesse, sodass du dich auf das eigentliche Tuning konzentrieren kannst.",
  whyAiDesc3: "Mit AI steigerst du deinen Durchsatz massiv und erhöhst dadurch direkt deinen Umsatz.",

  securityTitle: "Maximale Sicherheit",
  security1: "SSL Verschlüsselung",
  security2: "Datenschutz",
  security3: "DSGVO konform",
  security4: "Cloud-Sicherheit",
  security5: "Tägliche Backups",
  security6: "99.9% Verfügbarkeit",
  security7: "Schneller Support",

  faqTitle: "Häufig gestellte Fragen (FAQ)",
  faq1Q: "Kann ich kostenlos starten?",
  faq1A: "Ja, der Start und die Einrichtung deines Portals sind komplett kostenlos.",
  faq2Q: "Wie lange dauert die Einrichtung?",
  faq2A: "In unter 5 Minuten ist dein Basis-Portal online und einsatzbereit.",
  faq3Q: "Brauche ich Programmierkenntnisse?",
  faq3A: "Nein, unser System ist ein intuitiver Baukasten. Alles funktioniert ohne Code.",
  faq4Q: "Kann ich meine eigene Domain verwenden?",
  faq4A: "Ja, du kannst problemlos deine eigene Custom-Domain anbinden.",
  faq5Q: "Unterstützt ihr WinOLS?",
  faq5A: "Ja, wir bieten Export-Möglichkeiten zur Integration in WinOLS.",
  faq6Q: "Kann ich ECU-Dateien verkaufen?",
  faq6A: "Ja, du kannst Credits oder direkte Zahlungen für fertige Tuning-Files von deinen Kunden verlangen.",
  faq7Q: "Kann ich Reseller verwalten?",
  faq7A: "Ja, das System beinhaltet ein komplettes Reseller-Modul.",
  faq8Q: "Wie funktioniert AI?",
  faq8A: "Unsere AI analysiert Dateien und beantwortet Support-Fragen automatisch.",
  faq9Q: "Wie sicher sind meine Daten?",
  faq9A: "Wir setzen auf Enterprise-Grade Security und DSGVO-konforme Server.",
  faq10Q: "Kann ich jederzeit kündigen?",
  faq10A: "Ja, du kannst deinen Account jederzeit ohne versteckte Kosten schließen.",
  faq11Q: "Wer ist der Eigentümer der hochgeladenen Dateien?",
  faq11A: "Du bleibst immer Eigentümer deiner Daten. TunerPortal ist nur der Auftragsverarbeiter.",
  faq12Q: "Gibt es ein Limit für Dateiuploads?",
  faq12A: "Es gibt faire Fair-Use-Limits pro Datei (z.B. 50MB), aber keine Begrenzung der Gesamtanzahl an Dateien in kostenpflichtigen Tarifen.",
  faq13Q: "Funktioniert das Portal auch auf dem Smartphone?",
  faq13A: "Ja, TunerPortal ist 100% responsiv und Mobile-First gestaltet.",
  faq14Q: "Können meine Kunden Rechnungen herunterladen?",
  faq14A: "Ja, alle Transaktionen erzeugen automatisch korrekte Rechnungen für deine Kunden.",
  faq15Q: "Bietet ihr E-Mail Benachrichtigungen?",
  faq15A: "Absolut. Das System sendet automatisch Status-Updates an dich und deine Kunden.",
  faq16Q: "Gibt es ein Ticket-System?",
  faq16A: "Ja, ein vollständig in das Portal integriertes Ticket-System ist vorhanden.",
  faq17Q: "Unterstützt ihr Stripe und PayPal?",
  faq17A: "Ja, beide Payment-Provider lassen sich in wenigen Sekunden aktivieren.",
  faq18Q: "Ist das System White-Label?",
  faq18A: "Ja, deine Kunden sehen nur dein Logo und deine Marke, nicht TunerPortal.",
  faq19Q: "Kann ich Rabatte für Reseller einstellen?",
  faq19A: "Du kannst jedem Reseller individuelle Preise und Rabattstrukturen zuweisen.",
  faq20Q: "Wo werden die Server gehostet?",
  faq20A: "Unsere Server befinden sich in DSGVO-konformen Hochsicherheits-Rechenzentren in Europa."
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.SeoHomePage) {
    data.SeoHomePage = {};
  }
  
  Object.keys(newHomePage).forEach(key => {
    data.SeoHomePage[key] = newHomePage[key];
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${file}`);
});

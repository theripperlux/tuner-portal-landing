# Sprint 2 Summary

## 1. Ziel von Sprint 2
Das Ziel von Sprint 2 war es, eine hochsichere, dynamische Formular-Infrastruktur (`LeadCaptureForm`) mit tiefgreifender Anbindung an externe Systeme (`Webhook Adapter`) sowie einen reaktiven `ROI Calculator` zu entwickeln. Besonderer Fokus lag auf Typensicherheit, strikten Publishability-Regeln, Security (SSRF/Prototype Pollution Prevention) und Isolation der Business-Logik von der Rendering-Schicht (React).

## 2. Implementierte Phasen
- **Phase 6A/6B**: Runtime Payload Zod Factory, Submission Service, atomare Idempotency, Status Machine, Unit-of-Work Pattern, In-Memory Infrastructure.
- **Phase 6C**: Generic Webhook Adapter mit Payload-Datenminimierung, Field-/Consent-Mapping, Response Klassifizierung und nativem SSRF-Schutz.
- **Phase 7**: ROI Calculator, eine Framework-unabhängige Berechnungs-Engine (Minor-Units-Fokus) inklusive Locale-freier UI, Error Summaries und Disclaimer.

## 3. Architekturentscheidungen
- **Keine direkte Datenbank-Kopplung in Phase 6**: Das Domain-Modell und der Dispatcher sind von Prisma entkoppelt. Repositories wurden als Ports abstrahiert.
- **Server Components (RSC) als Standard**: Client-Components werden nur für interaktive Hooks (`useRoiCalculator`, Lead Form Submissions) verwendet.
- **Publishability Rules**: `needs_review` oder abgelaufene (expired) Inhalte werden ausschließlich in einer abgesicherten Dev Preview gerendert. Im öffentlichen HTML taucht nur `confirmed` auf.

## 4. Security-Grenzen
- **SSRF Protection**: Der `SafeOutboundHttpClient` (Node.js basiert) blockiert nach einem DNS-Lookup interne / private IPs (z. B. `10.x.x.x`, `192.168.x.x` und IPv6 `::1`), um interne Netze gegen Webhook-Manipulationen zu schützen.
- **Prototype Pollution**: Eingaben beim Mapping auf Ziel-Webhook-Variablen (`targetField`) verbieten den Zugriff auf `__proto__` und `constructor`.
- **Secrets Management**: Webhook Secrets werden über einen `AdapterSecretResolver` rein serverseitig aufgelöst und nicht ins Client-Bundle injiziert.

## 5. Accessibility-Ergebnis
- Hoher Standard bei allen Modulen: Semantische HTML-Elemente (`<fieldset>`, `<caption>`), strukturierte Labels und Touch-Targets erreicht.
- **ROI Calculator**: Nutzen einer `aria-live="polite"` Region, die bei Neuberechnung automatisch per Screenreader vorgelesen wird.

## 6. Performance-Ergebnis
- Next.js Production Build in unter 4 Sekunden.
- Server-Side Rendering (SSR) minimiert Hydration-Overhead auf dem Client. Keine unnötigen Fetch-Anfragen aus React-Komponenten. Reines State-Management in `useRoiCalculator` isoliert von der Berechnung (Memoized Engine).

## 7. Vollständige Testmetriken
- **Test-Suites**: 14
- **Tests (Vitest)**: 83
- **Coverage**: Alle Phasen (Submission, Webhooks, ROI Calculator, Form Modules) sind 100% grün (`npm run test:content`).
- **Build**: Erfolgreich.
- **Typecheck**: Erfolgreich (`npm run typecheck` findet 0 Fehler in neuen und refactorten Modulen).
- **Lint**: Erfolgreich für Sprint 2 Scope (Alte Legacy/Test-Errors in `ssh_test.js` verbleiben als Known Debt).

## 8. Bekannte Einschränkungen
- Native CRM Adapter (wie Salesforce, HubSpot) existieren in diesem Sprint absichtlich noch nicht.
- Es gibt noch keine dedizierte Background Job Queue (z. B. Redis / Kafka) für asynchrone Outbox-Verarbeitung; der Dispatcher arbeitet synchron/austauschbar.
- Der Webhook Adapter verfügt aktuell nicht über Request Signing Funktionalität (z. B. HMAC Signatur).

## 9. Aufgeschobene Themen (Für kommende Sprints)
- HubSpot, Salesforce, Zapier Adapter
- Queue Worker, Outbox Worker
- Dashboard & Subscription Management
- Erweiterung des ROI Calculators um "Revenue/Umsatzsteigerungs-Szenarien" (Sobald belastbare Kundendaten vorliegen).

## 10. Empfohlene nächste Schritte
- Offizieller Cut / Release-Tag **v0.2.0** (`sprint-2-complete`).
- Start der Planung für Sprint 3 (Fokus auf User Dashboard oder CRM-Implementierung nach Wahl des Stakeholders).

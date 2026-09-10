# Sprint 2 Release Checklist

## Verifizierungs-Matrix

- [x] **Linting**: Erfolgreich ohne kritische Warnungen oder Blockaden (`npm run lint`). Alt-Fehler aus Legacy-Code wurden als offene Tech-Debts dokumentiert.
- [x] **Typecheck**: Fehlerfrei (`npm run typecheck`). Alle `.ts` / `.tsx` Dateien kompilieren ohne Errors.
- [x] **Tests**: 100% Passing (83 von 83) über 14 Test-Suites (`npm run test:content` / vitest).
- [x] **Production Build**: Erfolgreich gebaut (`npm run build`). Next.js Static Pages & Server Components wurden korrekt erstellt.

## Security & Compliance
- [x] **SSRF Protection**: DNS-Rebinding / Private IPs in Webhook Adapter sind blockiert.
- [x] **Prototype Pollution**: Eingaben im FieldMapper verbieten den Zugriff auf `__proto__` und `constructor`.
- [x] **Keine Secrets**: Weder in Client Bundles noch Analytics (geprüft über `SafeOutboundHttpClient`).
- [x] **Datenschutz**: ROI Calculator sendet/speichert keine Eingaben.

## Publishability
- [x] Das System rendert öffentliche Seiten ausschließlich mit Content im Status `confirmed`. 
- [x] Unbestätigte (`needs_review`) und abgelaufene (Expires-Date überschritten) Contents werden blockiert bzw. nur in Dev Preview gezeigt.

## Modules Ready
- [x] FeatureGrid
- [x] Statistics
- [x] Testimonials
- [x] ComparisonTable
- [x] PricingTable
- [x] LeadCaptureForm (mit Security/Submission Layer)
- [x] ROI Calculator

## Documentation
- [x] Changelog aktualisiert
- [x] Sprint Summary verfasst
- [x] Spezifikationen (ROI, Webhooks) abgeschlossen

---
*Ready for Release Tag: v0.2.0 (sprint-2-complete)*

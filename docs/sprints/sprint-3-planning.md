# Sprint 3 Planning Document

## 1. Vision und Ziele von Sprint 3
Nach der erfolgreichen Stabilisierung des öffentlichen Frontends und der Formular-Infrastruktur in Sprint 2, richtet sich Sprint 3 auf die Erweiterung der B2B- und B2C-Prozesse. Ziel ist die Schaffung einer umfassenden **Customer & Partner Experience**, beginnend beim gesicherten Customer Dashboard, über die Anbindung an produktive CRM-Systeme (HubSpot) bis hin zur Vorbereitung von Monetarisierung (Billing) und Drittanbieter-Erweiterungen (Marketplace & API). 

## 2. Priorisierung der Features
Die Umsetzung erfolgt zwingend in dieser Reihenfolge:
1. **Customer Dashboard**: Zentrale Startseite für authentifizierte Kunden (Übersicht von Tuning-Files, Tickets, Analytics).
2. **Customer Portal**: Verwaltung von Einstellungen, Fahrzeugen, Rechnungen und Profilen.
3. **White-Label Administration**: Mandantenfähige Steuerung von Brandings (Logos, Farben) für Reseller/Partner.
4. **CRM-Adapter (HubSpot)**: Nativer Adapter für das Lead-Routing und die Synchronisierung von Kundenprofilen.
5. **Billing & Subscription**: Architektur für wiederkehrende Zahlungen und Pay-per-File/Credit-Systeme.
6. **Marketplace Foundation**: Kernstruktur für externe Plugin- oder Service-Erweiterungen.
7. **API Center**: Schnittstellen-Verwaltung (Tokens, Webhooks, Limits) für B2B-Kunden.
8. **Developer Portal**: Öffentliche/Zugangsbeschränkte Dokumentation der TunerPortal APIs.

## 3. Architekturübersicht
- **Authentifizierung**: Ausbau von NextAuth/JWT für strenge RBAC (Role-Based Access Control) auf Tenant-Ebene.
- **Micro-Frontends / Monorepo-Scopes**: Strikte Trennung zwischen Public Website (`app/(public)`), Customer Portal (`app/dashboard`) und Admin/White-Labeling (`app/admin`).
- **Adapter-Erweiterung**: Das in Sprint 2 geschaffene Adapter-Pattern (`FormSubmissionAdapter`) wird auf das CRM-Subsystem (`CrmSyncAdapter`) übertragen.

## 4. Neue Module
- **Dashboard Widgets**: Statistische Auswertungen (Credits, offene Tickets, verarbeitete Files).
- **Profile Module**: User Settings und Notification Preferences.
- **Billing Module**: Checkout, Invoicing, Credit-Ledger.

## 5. Benötigte Domain-Modelle
- `Tenant` / `Organization`
- `CustomerProfile`
- `WhiteLabelConfig`
- `CreditLedgerEntry`
- `SubscriptionStatus`
- `ApiToken`

## 6. Repository-Erweiterungen
- `CustomerRepository`: CRUD für Kundenprofile.
- `LedgerRepository`: Transaktionssichere Speicherung von Credits.
- `WhiteLabelRepository`: Abruf von Branding-Settings per Host/Tenant-ID.
- `ApiTokenRepository`: Gesicherte (gehashte) Tokens.

## 7. Adapter-Erweiterungen
- **HubSpotCrmAdapter**: Implementierung der API-Synchronisierung mit HubSpot (Erweiterung der `FormSubmission` für Lead Capture).
- **Stripe/Payment Adapter**: Generischer Port für Billing.

## 8. Datenmodelle (Prisma / Schema)
- Tabellen für `Tenant`, `User`, `ApiKey`, `Subscription`, `Invoice`.
- Migrationen für White-Labeling (z. B. Custom Domains).

## 9. UI-Komponenten
- **Dashboard Layout**: Gesichertes App-Shell-Layout mit Sidebar und Header.
- **Data Tables**: Performante, zugängliche Tabellen für Tickets und Rechnungen.
- **Charts/Visualisierungen**: (Optional) für Analytics-Widgets.

## 10. Teststrategie
- **Unit Tests**: Für die Billing/Ledger-Logik (Keine negativen Credits erlaubt).
- **Integration Tests**: Für den HubSpot-Adapter (Mocking der externen API).
- **E2E Tests**: Für den Login-Fluss und das Customer Dashboard.

## 11. Migrationsbedarf
- Die bisherige User-Struktur muss auf Mandantenfähigkeit (Tenants) umgestellt werden, sofern noch nicht geschehen.
- Existierende Formulare müssen an das CRM-Routing angeschlossen werden.

## 12. Risiken
- **Komplexität des Credit-Ledgers**: Transaktionale Sicherheit bei gleichzeitigen API-Calls (Race Conditions).
- **CRM Sync Limits**: Rate Limits bei HubSpot (muss via Queue/Retry-Worker abgefangen werden).

## 13. Abhängigkeiten
- Die Implementierung des HubSpot-Adapters setzt voraus, dass der Queue/Outbox Worker (aus Sprint 2 aufgeschoben) für Retries gebaut wird.

## 14. Release-Ziel
- **v0.3.0**: Ein lauffähiges Customer Portal mit White-Labeling-Fähigkeit und aktiver HubSpot-Integration zur vollautomatisierten Kundenakquise.

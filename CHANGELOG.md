# Changelog

All notable changes to the TunerPortal frontend architecture will be documented in this file.

## [v0.2.0 - Sprint 2 Complete]

### Added
- **FeatureGrid Module**: Fully responsive grids with dynamic items and verified Zod content schemas.
- **Statistics Module**: Key-value layout for presenting metrics securely.
- **Testimonials Module**: Carousel/List presentation of verified client feedback.
- **ComparisonTable Module**: Dynamic tables supporting limits, booleans, strings and tiered pricing columns.
- **PricingTable Module**: Complex multi-tier subscription rendering including CTA configuration and footnotes.
- **LeadCaptureForm Module**: Highly secure, dynamically generated lead submission forms with conditional logic, typed inputs, honeypot fields, and consent versioning.
- **ROI Calculator Module**: Framework-agnostic ROI calculation engine with strict minor-unit monetary logic, custom warning schemas, and pure client-side React UI (Phase 7).
- **Zod Content Factory**: Deeply nested schema validation for dynamic JSON content from the CMS.
- **Form Submission Architecture**:
  - `SubmissionDispatcher`: Atomic routing of forms via Unit-of-Work to local/remote stores.
  - `FormPayloadSchemaFactory`: Dynamically generates Zod schemas at runtime from module configurations to block over-posting.
  - `WebhookSubmissionAdapter`: Complete implementation of an Outbound Webhook Adapter capable of mapping JSON payloads and consents.
- **Content Engine Enhancements**: Robust `Publishability` rules enforcing `ContentStatus` (confirmed vs. needs_review/rejected) before allowing public rendering.

### Changed
- **Content Pipeline**: Migrated the core `ModuleRenderer` to enforce `Publishability` strictly server-side. Hidden or unverified content now exclusively renders in Dev Preview or throws secure fallbacks.
- **Internationalization**: Locale strategies enforce `hreflang`, canonical tags, and strict formatting (e.g. `Intl.NumberFormat`).
- **Adapter Infrastructure**: Submissions are now entirely decoupled from Prisma. In-Memory and Webhook adapters demonstrate zero-dependency generic integration.

### Security
- **SSRF Protection**: `NodeSafeOutboundHttpClient` employs a custom DNS-level verification strategy, blocking resolutions to private IPv4 (10.0.0.0/8, 192.168.0.0/16, etc.) and IPv6 local addresses before connection attempts.
- **Prototype Pollution Prevention**: Strict mapping validation in `WebhookPayloadBuilder` denies dangerous properties like `__proto__` and `constructor`.
- **Honeypot Implementation**: `LeadCaptureForm` securely blocks submissions triggering honeypot fields, responding securely to clients while logging internal security flags.
- **No-Secret Client Bundles**: Next.js components receive absolutely zero API secrets. Secrets are resolved server-side through `AdapterSecretResolver`.

### Fixed
- **Type Checking**: Cleaned up the entire `src/` directory to pass strict TypeScript constraints (`noEmit`).
- **Data Limits**: Ensured robust size restrictions on `WebhookAdapter` bodies (e.g. 100KB payload maximums, 5s timeout enforcement).

### Known Limitations
- The `WebhookSubmissionAdapter` currently lacks request signing functionality.
- There are no native CRM adapters (HubSpot, Salesforce, Pipedrive) in the system yet.
- The `ROI Calculator` intentionally lacks a "Umsatzsteigerung" (Revenue Gain) mode pending actual verified customer data, defaulting strictly to Time & Cost Savings.
- The `SubmissionService` processes queues synchronously (keine echte Hintergrund-Queue). Outbox/Worker patterns are deferred.

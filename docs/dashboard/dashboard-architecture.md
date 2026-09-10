# Dashboard Architecture

This document describes the hardened architecture and RBAC model of the Customer Dashboard.

## 1. Domain Models & Status

### Tenant Status
Tenants are no longer managed by a simple `approved: boolean` or `tenantRegistrationStatus`. We have two orthogonal status fields:
- `TenantStatus`: `"pending" | "active" | "suspended" | "disabled" | "rejected"`
- `TenantOnboardingStatus`: `"not_started" | "in_progress" | "completed" | "blocked"`

### RBAC Model
The dashboard uses a rigid RBAC policy (`DashboardAuthorizationPolicy`).
Roles: `owner`, `admin`, `manager`, `staff`, `customer`.
Permissions: `dashboard:view`, `credits:view`, `files:view`, `tickets:view`, `profile:view`, `settings:view`.

The UI navigation sidebar (`dashboard-navigation.ts`) filters its links dynamically based on the current user's permissions.

## 2. Query Service Layer

React components (like `page.tsx`, `layout.tsx`) **do not interact with the database directly**.
They consume the `DashboardOverviewQuery`, which guarantees:
1. Authorization Check (Tenant must be `active` & `completed`).
2. Tenant Isolation (`tenantId` is statically passed into all Prisma `findMany` calls).
3. O(1) fetching (using `Promise.all` across repositories).

The query returns a strictly typed `DashboardOverviewResult` containing `DashboardWidgetState<T>` objects.

## 3. Widget State Model

A Widget (e.g. "Recent Tickets", "Credits") is never `undefined` or a raw value. It follows a strict state machine:
- **Ready**: Contains the validated data payload.
- **Empty**: Contains an `emptyState` configuration (Title, Description).
- **Unavailable**: Contains a `reason` (e.g., `not_configured`).
- **Error**: Contains a `publicErrorCode`.

This prevents the UI from rendering dummy numbers (like `0 Credits`) if the database fetch fails or the service is offline.

## 4. Auth Boundary

The NextAuth `session` is strictly typed via `types/next-auth.d.ts` to include `tenantId`, `tenantStatus`, and `tenantOnboardingStatus`.
If the user's tenant is `pending`, they are restricted from the main dashboard. If they are `active` but `not_started`, they are routed to the Setup Client (`DashboardClient`).

## 5. Privacy & Security

- **No Dummy Data**: All numerical/list values come from authenticated Repositories.
- **SSRF / Prototype Pollution**: Ensured globally in previous sprints.
- **Cache**: `export const dynamic = 'force-dynamic'` is used to ensure no private Dashboard data leaks via CDN.

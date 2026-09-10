/**
 * Thin client for the NestJS backend's PUBLIC tenant-registration API
 * (`POST /public/tenant-registration`). The landing site collects the
 * account + domain data, then forwards it here to create a PENDING
 * tenant registration that a super-admin later approves.
 *
 * The backend is the source of truth for validation — we only mirror
 * the cheap shape checks here so we can fail fast with a friendly
 * message instead of bouncing off a 400/409 round-trip.
 */

const TENANT_API_URL = process.env.TENANT_API_URL || "http://localhost:2600";

// Mirrors backend HOST_REGEX (bare hostname, at least one dot, no
// protocol/path/port). Used for a pre-flight check only.
const HOST_REGEX =
  /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;

// Mirrors backend SLUG_REGEX (lowercase letters, digits, hyphens; no
// leading/trailing hyphen; ~1-40 chars).
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export interface TenantRegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  companySlug: string;
  adminDomain: string;
  customerDomain: string;
  message?: string;
}

export interface TenantRegistrationResult {
  id: string;
  status: string; // "pending"
}

/**
 * Normalize a domain input to a bare hostname. No https:// and no path
 * are required from the user — we strip them if present:
 *   "https://portal.domain.com/foo" → "portal.domain.com"
 *   "admin.domain.com"              → "admin.domain.com"
 * Trailing dots and case are also normalized.
 */
export function cleanHost(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "") // strip protocol
    .replace(/\/.*$/, "") // strip any path (everything from the first slash)
    .replace(/\.+$/, "") // strip trailing dot(s)
    .toLowerCase();
}

/**
 * Build a backend-valid companySlug from a company name (or any
 * fallback string). Lowercases, replaces non-alphanumerics with a
 * single hyphen, trims hyphens, and clamps to 40 chars. Returns "" if
 * nothing usable remains — caller decides the fallback.
 */
export function slugify(source: string): string {
  const slug = source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return SLUG_REGEX.test(slug) ? slug : "";
}

export function isValidHost(host: string): boolean {
  return HOST_REGEX.test(host);
}

/**
 * POST the registration to the backend public endpoint. Throws an
 * Error with the backend's message on a non-2xx response so callers
 * can surface it verbatim to the applicant.
 */
export async function submitTenantRegistration(
  input: TenantRegistrationInput,
): Promise<TenantRegistrationResult> {
  let res: Response;
  try {
    res = await fetch(`${TENANT_API_URL}/public/tenant-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      // Never let Next cache a mutation.
      cache: "no-store",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not reach the registration service (${msg}).`);
  }

  if (!res.ok) {
    // The backend returns { message: string | string[] } on errors.
    let message = `Registration failed (HTTP ${res.status}).`;
    try {
      const body = await res.json();
      if (Array.isArray(body?.message)) message = body.message.join(", ");
      else if (typeof body?.message === "string") message = body.message;
    } catch {
      // keep default
    }
    throw new Error(message);
  }

  return (await res.json()) as TenantRegistrationResult;
}

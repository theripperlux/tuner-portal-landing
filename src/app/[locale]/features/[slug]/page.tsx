import { redirect } from '@/i18n/routing';

/**
 * These per-feature sub-pages (white-label-platform, customer-management,
 * billing-invoicing, ai-automation) each only had a hero + 2-3 bullet
 * points — not enough content to justify their own pages or the nav
 * sub-menu that used to link to them. Consolidated into the single, more
 * complete /features hub page instead. Redirecting (rather than letting
 * these 404) so any existing bookmarks or indexed links still land
 * somewhere useful.
 */
export default async function FeaturePage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { locale } = await params;
  redirect({ href: '/features', locale });
}

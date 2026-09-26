-- Adds a real platform-wide superadmin flag on User, replacing the
-- hardcoded-email / per-tenant-role checks that used to gate the admin
-- console and admin API routes. Defaults to false for every existing and
-- new row; must be flipped on deliberately via
-- scripts/promote-platform-admin.ts, never via a user-facing endpoint.
ALTER TABLE "User" ADD COLUMN "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false;

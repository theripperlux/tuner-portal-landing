/*
  Warnings:

  - You are about to drop the column `description` on the `CreditTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.
  - Added the required column `idempotencyKey` to the `CreditTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipId` to the `CreditTransaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `tenantId` on table `CreditTransaction` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `tenantId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CreditTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditTransaction_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "TenantMembership" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Explicit Validation Mechanism: Fail-closed with a clear operational error message if ambiguity is detected
CREATE TABLE "_MigrationValidation" (id INTEGER PRIMARY KEY);
CREATE TRIGGER "_MigrationValidation_trigger" BEFORE INSERT ON "_MigrationValidation"
FOR EACH ROW
WHEN (SELECT COUNT(*) FROM "User" WHERE "credits" > 0 AND (SELECT COUNT(*) FROM "TenantMembership" tm WHERE tm."userId" = "User"."id") <> 1) > 0
BEGIN
  SELECT RAISE(ABORT, 'Migration failed: Found legacy users with credits but no distinct tenant membership. Please assign them to a tenant before migrating.');
END;
INSERT INTO "_MigrationValidation" (id) VALUES (1);
DROP TABLE "_MigrationValidation";

INSERT INTO "new_CreditTransaction" ("amount", "createdAt", "id", "tenantId", "type", "membershipId", "reason", "idempotencyKey") 
SELECT 
  ct."amount", ct."createdAt", ct."id", ct."tenantId", ct."type", 
  (SELECT tm."id" FROM "TenantMembership" tm WHERE tm."tenantId" = ct."tenantId" AND (SELECT COUNT(*) FROM "TenantMembership" tm2 WHERE tm2."tenantId" = ct."tenantId") = 1),
  ct."description",
  'legacy_' || ct."id"
FROM "CreditTransaction" ct;
DROP TABLE "CreditTransaction";
ALTER TABLE "new_CreditTransaction" RENAME TO "CreditTransaction";
CREATE INDEX "CreditTransaction_tenantId_membershipId_createdAt_idx" ON "CreditTransaction"("tenantId", "membershipId", "createdAt");
CREATE UNIQUE INDEX "CreditTransaction_tenantId_idempotencyKey_key" ON "CreditTransaction"("tenantId", "idempotencyKey");
CREATE TABLE "new_TenantMembership" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "membershipStatus" TEXT NOT NULL DEFAULT 'active',
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TenantMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TenantMembership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TenantMembership" ("createdAt", "id", "membershipStatus", "role", "tenantId", "updatedAt", "userId", "credits") 
SELECT 
  tm."createdAt", tm."id", tm."membershipStatus", tm."role", tm."tenantId", tm."updatedAt", tm."userId",
  CASE 
    WHEN (SELECT COUNT(*) FROM "TenantMembership" tm2 WHERE tm2."userId" = tm."userId") = 1 
    THEN COALESCE((SELECT u."credits" FROM "User" u WHERE u."id" = tm."userId"), 0)
    ELSE 0
  END
FROM "TenantMembership" tm;
DROP TABLE "TenantMembership";
ALTER TABLE "new_TenantMembership" RENAME TO "TenantMembership";
CREATE INDEX "TenantMembership_userId_idx" ON "TenantMembership"("userId");
CREATE INDEX "TenantMembership_tenantId_idx" ON "TenantMembership"("tenantId");
CREATE UNIQUE INDEX "TenantMembership_userId_tenantId_key" ON "TenantMembership"("userId", "tenantId");
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("createdAt", "id", "message", "status", "subject", "updatedAt", "userId", "tenantId") 
SELECT 
  t."createdAt", t."id", t."message", t."status", t."subject", t."updatedAt", t."userId",
  (SELECT tm."tenantId" FROM "TenantMembership" tm WHERE tm."userId" = t."userId" AND (SELECT COUNT(*) FROM "TenantMembership" tm2 WHERE tm2."userId" = t."userId") = 1)
FROM "Ticket" t;
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE INDEX "Ticket_tenantId_userId_createdAt_idx" ON "Ticket"("tenantId", "userId", "createdAt");
CREATE INDEX "Ticket_tenantId_status_idx" ON "Ticket"("tenantId", "status");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "address" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "euVat" TEXT,
    "phone" TEXT,
    "companySlug" TEXT,
    "adminDomain" TEXT,
    "customerDomain" TEXT,
    "tenantRegistrationId" TEXT,
    "tenantRegistrationError" TEXT,
    "tenantRegistrationSubmittedAt" DATETIME,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "portalPassword" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("address", "adminDomain", "companyName", "companySlug", "country", "createdAt", "customerDomain", "email", "euVat", "firstName", "id", "lastName", "name", "password", "phone", "portalPassword", "tenantRegistrationError", "tenantRegistrationId", "tenantRegistrationSubmittedAt", "updatedAt", "zip") SELECT "address", "adminDomain", "companyName", "companySlug", "country", "createdAt", "customerDomain", "email", "euVat", "firstName", "id", "lastName", "name", "password", "phone", "portalPassword", "tenantRegistrationError", "tenantRegistrationId", "tenantRegistrationSubmittedAt", "updatedAt", "zip" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

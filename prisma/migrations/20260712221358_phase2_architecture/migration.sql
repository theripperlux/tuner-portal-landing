/*
  Warnings:

  - You are about to drop the column `membershipId` on the `StoredFile` table. All the data in the column will be lost.
*/
-- Fail-closed validation trigger to block migration if unmigratable StoredFiles exist (e.g. without tenantId)
CREATE TABLE "_MigrationValidation" ( id INTEGER PRIMARY KEY );
CREATE TRIGGER "FailClosed_StoredFile_Migration"
BEFORE INSERT ON "_MigrationValidation"
BEGIN
  SELECT RAISE(ABORT, 'Migration blocked: Found StoredFile with missing tenantId or invalid ownership.')
  FROM "StoredFile"
  WHERE "tenantId" IS NULL OR ("ownerUserId" IS NULL AND "membershipId" IS NULL);
END;
INSERT INTO "_MigrationValidation" (id) VALUES (1);
DROP TABLE "_MigrationValidation";

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventType" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoredFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "uploadedByMembershipId" TEXT,
    "storageProvider" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checksum" TEXT,
    "detectedContentType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "StoredFile_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StoredFile_uploadedByMembershipId_fkey" FOREIGN KEY ("uploadedByMembershipId") REFERENCES "TenantMembership" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StoredFile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StoredFile" ("checksum", "createdAt", "deletedAt", "detectedContentType", "id", "originalFilename", "ownerUserId", "sizeBytes", "status", "storageKey", "storageProvider", "tenantId") SELECT "checksum", "createdAt", "deletedAt", "detectedContentType", "id", "originalFilename", "ownerUserId", "sizeBytes", "status", "storageKey", "storageProvider", "tenantId" FROM "StoredFile";
DROP TABLE "StoredFile";
ALTER TABLE "new_StoredFile" RENAME TO "StoredFile";
CREATE INDEX "StoredFile_tenantId_uploadedByMembershipId_idx" ON "StoredFile"("tenantId", "uploadedByMembershipId");
CREATE INDEX "StoredFile_storageKey_idx" ON "StoredFile"("storageKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "OutboxEvent_status_createdAt_idx" ON "OutboxEvent"("status", "createdAt");

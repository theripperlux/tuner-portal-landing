/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `TicketReply` table. All the data in the column will be lost.
  - You are about to drop the column `creditsCost` on the `TuningJob` table. All the data in the column will be lost.
  - You are about to drop the column `originalFile` on the `TuningJob` table. All the data in the column will be lost.
  - You are about to drop the column `tunedFile` on the `TuningJob` table. All the data in the column will be lost.
  - Added the required column `authorMembershipId` to the `TicketReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `TicketReply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calculatedCreditCost` to the `TuningJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `membershipId` to the `TuningJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileId` to the `TuningJob` table without a default value. This is not possible if the table is not empty.
  - Made the column `tenantId` on table `TuningJob` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "StoredFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "membershipId" TEXT,
    "ownerUserId" TEXT,
    "storageProvider" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checksum" TEXT,
    "detectedContentType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "StoredFile_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StoredFile_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "TenantMembership" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StoredFile_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TicketReply" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "authorMembershipId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TicketReply_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TicketReply_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketReply_authorMembershipId_fkey" FOREIGN KEY ("authorMembershipId") REFERENCES "TenantMembership" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TicketReply" ("createdAt", "id", "message", "ticketId") SELECT "createdAt", "id", "message", "ticketId" FROM "TicketReply";
DROP TABLE "TicketReply";
ALTER TABLE "new_TicketReply" RENAME TO "TicketReply";
CREATE INDEX "TicketReply_tenantId_ticketId_idx" ON "TicketReply"("tenantId", "ticketId");
CREATE TABLE "new_TuningJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "originalFileId" TEXT NOT NULL,
    "tunedFileId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "calculatedCreditCost" INTEGER NOT NULL,
    "pricingVersion" TEXT,
    "submissionIdempotencyKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TuningJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TuningJob_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TuningJob_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "TenantMembership" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TuningJob_originalFileId_fkey" FOREIGN KEY ("originalFileId") REFERENCES "StoredFile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TuningJob_tunedFileId_fkey" FOREIGN KEY ("tunedFileId") REFERENCES "StoredFile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TuningJob" ("createdAt", "id", "status", "tenantId", "userId") SELECT "createdAt", "id", "status", "tenantId", "userId" FROM "TuningJob";
DROP TABLE "TuningJob";
ALTER TABLE "new_TuningJob" RENAME TO "TuningJob";
CREATE UNIQUE INDEX "TuningJob_submissionIdempotencyKey_key" ON "TuningJob"("submissionIdempotencyKey");
CREATE INDEX "TuningJob_tenantId_membershipId_createdAt_idx" ON "TuningJob"("tenantId", "membershipId", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "StoredFile_tenantId_membershipId_idx" ON "StoredFile"("tenantId", "membershipId");

-- CreateIndex
CREATE INDEX "StoredFile_storageKey_idx" ON "StoredFile"("storageKey");

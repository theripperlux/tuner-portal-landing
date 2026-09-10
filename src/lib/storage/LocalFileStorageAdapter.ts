import { 
  FileStoragePort, 
  CreateUploadIntentCommand, 
  UploadIntent, 
  CompleteUploadCommand, 
  StoredFileDetails, 
  SignedDownload 
} from "./FileStoragePort";
import { TenantScope } from "@/lib/repositories/dashboard.repository.types";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export class LocalFileStorageAdapter implements FileStoragePort {
  async createUploadIntent(
    scope: TenantScope,
    command: CreateUploadIntentCommand
  ): Promise<UploadIntent> {
    const storageKey = `local/${scope.tenantId}/${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Create the record in PENDING state
    const file = await prisma.storedFile.create({
      data: {
        tenantId: scope.tenantId,
        uploadedByMembershipId: scope.membershipId,
        ownerUserId: scope.userId,
        storageProvider: "local",
        storageKey,
        originalFilename: command.originalFilename,
        sizeBytes: command.sizeBytes,
        detectedContentType: command.detectedContentType,
        status: "PENDING",
      }
    });

    return {
      uploadId: file.id,
      uploadUrl: `/api/internal/local-storage-upload?fileId=${file.id}`,
      method: "POST",
      maxSizeBytes: 50 * 1024 * 1024 // 50MB
    };
  }

  async completeUpload(
    scope: TenantScope,
    command: CompleteUploadCommand
  ): Promise<StoredFileDetails> {
    const file = await prisma.storedFile.findUnique({
      where: { id: command.uploadId }
    });

    if (!file || file.tenantId !== scope.tenantId) {
      throw new Error("File not found or unauthorized");
    }

    if (file.status !== "PENDING" && file.status !== "UPLOADED") {
      throw new Error("Invalid file state for completion");
    }

    // In a real local adapter, we would verify the file exists on disk, check magic bytes, calculate checksum, etc.
    // For now we just mark it as QUARANTINED (ready for job submission).
    
    const updated = await prisma.storedFile.update({
      where: { id: command.uploadId },
      data: {
        status: "QUARANTINED",
        checksum: command.expectedChecksum || "dummy-checksum"
      }
    });

    return updated as StoredFileDetails;
  }

  async createDownloadUrl(
    scope: TenantScope,
    fileId: string
  ): Promise<SignedDownload> {
    const file = await prisma.storedFile.findUnique({
      where: { id: fileId }
    });

    if (!file || file.tenantId !== scope.tenantId) {
      throw new Error("File not found or unauthorized");
    }

    // Return a dummy route that would serve the file from local disk
    return {
      downloadUrl: `/api/internal/local-storage-download?fileId=${file.id}&token=${crypto.randomBytes(16).toString('hex')}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
    };
  }

  async deleteFile(
    scope: TenantScope,
    fileId: string
  ): Promise<void> {
    const file = await prisma.storedFile.findUnique({
      where: { id: fileId }
    });

    if (!file || file.tenantId !== scope.tenantId) {
      throw new Error("File not found or unauthorized");
    }

    await prisma.storedFile.update({
      where: { id: fileId },
      data: {
        status: "DELETED",
        deletedAt: new Date()
      }
    });
  }
}

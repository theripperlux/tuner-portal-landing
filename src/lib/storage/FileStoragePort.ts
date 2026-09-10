import { TenantScope } from "@/lib/repositories/dashboard.repository.types";

export interface CreateUploadIntentCommand {
  originalFilename: string;
  sizeBytes: number;
  detectedContentType: string;
}

export interface UploadIntent {
  uploadId: string; // The StoredFile.id
  uploadUrl: string;
  method: string;
  headers?: Record<string, string>;
  maxSizeBytes: number;
}

export interface CompleteUploadCommand {
  uploadId: string;
  expectedChecksum?: string;
}

export interface StoredFileDetails {
  id: string;
  tenantId: string;
  storageProvider: string;
  storageKey: string;
  originalFilename: string;
  sizeBytes: number;
  checksum: string | null;
  detectedContentType: string | null;
  status: "PENDING" | "UPLOADED" | "VALIDATING" | "QUARANTINED" | "READY" | "REJECTED" | "DELETED";
}

export interface SignedDownload {
  downloadUrl: string;
  expiresAt: Date;
}

export interface FileStoragePort {
  createUploadIntent(
    scope: TenantScope,
    command: CreateUploadIntentCommand,
  ): Promise<UploadIntent>;

  completeUpload(
    scope: TenantScope,
    command: CompleteUploadCommand,
  ): Promise<StoredFileDetails>;

  createDownloadUrl(
    scope: TenantScope,
    fileId: string,
  ): Promise<SignedDownload>;

  deleteFile(
    scope: TenantScope,
    fileId: string,
  ): Promise<void>;
}

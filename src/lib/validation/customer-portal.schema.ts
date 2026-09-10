import { z } from "zod";

// Pagination
export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
}).strict();

// Upload
export const createUploadIntentSchema = z.object({
  originalFilename: z.string().min(1).max(255),
  sizeBytes: z.number().int().positive().max(1024 * 1024 * 100), // 100MB max
  detectedContentType: z.string().min(1).max(100)
}).strict();

export const completeUploadSchema = z.object({
  uploadId: z.string().cuid(),
  expectedChecksum: z.string().length(64).optional() // SHA-256 is 64 hex chars
}).strict();

// Jobs
export const submitTuningJobSchema = z.object({
  uploadId: z.string().cuid(),
  vehicleId: z.string().min(1),
  selectedServiceIds: z.array(z.string().min(1)).min(1),
  customerNote: z.string().max(2000).optional(),
  idempotencyKey: z.string().min(16).max(128)
}).strict();

// Tickets
export const createTicketSchema = z.object({
  subject: z.string().min(3).max(100),
  message: z.string().min(10).max(5000)
}).strict();

export const createTicketReplySchema = z.object({
  message: z.string().min(2).max(5000)
}).strict();

// ID params
export const idParamSchema = z.object({
  id: z.string().cuid()
}).strict();

import { FormSubmission, FormSubmissionStatus, SubmissionAuditEvent } from '../types';

export interface FormSubmissionRepository {
  create(submission: FormSubmission): Promise<void>;
  findById(submissionId: string): Promise<FormSubmission | null>;
  updateStatus(submissionId: string, status: FormSubmissionStatus): Promise<void>;
}

export type IdempotencyScope = string;

export type IdempotencyRecord = {
  scope: IdempotencyScope;
  payloadHash: string;
  submissionId: string;
  createdAt: string;
  expiresAt: string;
};

export type IdempotencyAcquireResult =
  | { status: "acquired"; record: IdempotencyRecord }
  | { status: "existing_same_payload"; record: IdempotencyRecord }
  | { status: "conflict"; record: IdempotencyRecord };

export interface IdempotencyStore {
  acquire(record: IdempotencyRecord): Promise<IdempotencyAcquireResult>;
  find(scope: IdempotencyScope): Promise<IdempotencyRecord | null>;
}

export interface SubmissionAuditRepository {
  append(submissionId: string, event: SubmissionAuditEvent): Promise<void>;
}

export interface SubmissionRepositories {
  formSubmissions: FormSubmissionRepository;
  idempotency: IdempotencyStore;
  audit: SubmissionAuditRepository;
}

export interface SubmissionUnitOfWork {
  execute<T>(operation: (repositories: SubmissionRepositories) => Promise<T>): Promise<T>;
}

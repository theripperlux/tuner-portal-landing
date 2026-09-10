import { ValidatedFormPayload } from '../../types';
import { FormSubmission, FormSubmissionStatus, SubmissionAuditEvent, SubmissionSecuritySignal } from '../types';
import { 
  FormSubmissionRepository, 
  IdempotencyAcquireResult, 
  IdempotencyRecord, 
  IdempotencyStore, 
  SubmissionAuditRepository, 
  SubmissionRepositories, 
  SubmissionUnitOfWork 
} from '../ports/Persistence';
import { SubmissionSecurityDecision, SubmissionSecurityPolicy } from '../ports/Security';
import { Clock, SubmissionIdGenerator, SubmissionPayloadHasher } from '../ports/Utilities';

export class InMemoryFormSubmissionRepository implements FormSubmissionRepository {
  public store = new Map<string, FormSubmission>();

  async create(submission: FormSubmission): Promise<void> {
    if (this.store.has(submission.submissionId)) throw new Error('Submission already exists');
    this.store.set(submission.submissionId, submission);
  }

  async findById(submissionId: string): Promise<FormSubmission | null> {
    return this.store.get(submissionId) || null;
  }

  async updateStatus(submissionId: string, status: FormSubmissionStatus): Promise<void> {
    const sub = this.store.get(submissionId);
    if (!sub) throw new Error('Submission not found');
    sub.status = status;
  }
}

export class InMemoryIdempotencyStore implements IdempotencyStore {
  public store = new Map<string, IdempotencyRecord>();

  async acquire(record: IdempotencyRecord): Promise<IdempotencyAcquireResult> {
    const existing = this.store.get(record.scope);
    if (existing) {
      if (existing.payloadHash === record.payloadHash) {
        return { status: 'existing_same_payload', record: existing };
      }
      return { status: 'conflict', record: existing };
    }
    this.store.set(record.scope, record);
    return { status: 'acquired', record };
  }

  async find(scope: string): Promise<IdempotencyRecord | null> {
    return this.store.get(scope) || null;
  }
}

export class InMemorySubmissionAuditRepository implements SubmissionAuditRepository {
  public events: Array<{ submissionId: string, event: SubmissionAuditEvent }> = [];

  async append(submissionId: string, event: SubmissionAuditEvent): Promise<void> {
    this.events.push({ submissionId, event });
  }
}

export class DummyUnitOfWork implements SubmissionUnitOfWork {
  constructor(public repos: SubmissionRepositories) {}

  async execute<T>(operation: (repositories: SubmissionRepositories) => Promise<T>): Promise<T> {
    // In memory mock just directly executes without real transaction locks
    return operation(this.repos);
  }
}

export class MockClock implements Clock {
  public currentTime = new Date('2026-07-12T12:00:00Z');
  now(): Date {
    return this.currentTime;
  }
}

export class MockIdGenerator implements SubmissionIdGenerator {
  public nextId = 'sub-1';
  public counter = 1;
  generate(): string {
    return `sub-${this.counter++}`;
  }
}

export class MockPayloadHasher implements SubmissionPayloadHasher {
  async hash(payload: ValidatedFormPayload): Promise<string> {
    // Einfacher deterministischer String-Dump für Tests
    return JSON.stringify(payload.fields);
  }
}

export class MockSecurityPolicy implements SubmissionSecurityPolicy {
  evaluate(signals: readonly SubmissionSecuritySignal[]): SubmissionSecurityDecision {
    const honeypot = signals.find(s => s.type === 'honeypot_triggered');
    if (honeypot) return { accepted: false, internalReason: 'honeypot', publicError: { code: 'validation_error', messageId: 'errors.invalid' } };
    return { accepted: true };
  }
}

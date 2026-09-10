import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultSubmissionService } from '../SubmissionService';
import { InMemorySubmissionAdapter } from '../InMemorySubmissionAdapter';
import { AdapterRegistry, AdapterId, FormSubmissionAdapter, SubmitFormCommand, SubmissionRoutingPolicy, AdapterResolutionResult } from '../types';
import { LeadCaptureFormModule } from '@/types/modules';
import { SynchronousSubmissionDeliveryDispatcher } from '../SynchronousSubmissionDeliveryDispatcher';
import { 
  DummyUnitOfWork, 
  InMemoryFormSubmissionRepository, 
  InMemoryIdempotencyStore, 
  InMemorySubmissionAuditRepository, 
  MockClock, 
  MockIdGenerator, 
  MockPayloadHasher, 
  MockSecurityPolicy
} from './mocks';
import { SubmissionRepositories } from '../ports/Persistence';

class TestRegistry implements AdapterRegistry {
  private adapters = new Map<AdapterId, FormSubmissionAdapter>();
  register(adapter: FormSubmissionAdapter) { this.adapters.set(adapter.id, adapter); }
  getAdapter(id: AdapterId): FormSubmissionAdapter | undefined { return this.adapters.get(id); }
  resolveAdapter(id: AdapterId): AdapterResolutionResult {
    const a = this.adapters.get(id);
    return a ? { success: true, adapter: a } : { success: false, error: 'adapter_not_registered' };
  }
}

describe('SubmissionService & Dispatcher', () => {
  let registry: TestRegistry;
  let inMemoryAdapter: InMemorySubmissionAdapter;
  let formRepo: InMemoryFormSubmissionRepository;
  let idemStore: InMemoryIdempotencyStore;
  let auditRepo: InMemorySubmissionAuditRepository;
  let uow: DummyUnitOfWork;
  let dispatcher: SynchronousSubmissionDeliveryDispatcher;
  let service: DefaultSubmissionService;
  let clock: MockClock;

  const mockForm: LeadCaptureFormModule = {
    id: 'f1',
    type: 'lead_capture_form',
    version: '1.0',
    translationGroupId: 'tg1',
    status: 'published',
    design: { layout: 'standard' },
    sections: [{
      id: 's1',
      status: 'confirmed',
      content: [{ type: 'text', id: 'firstName', name: 'firstName', label: 'First Name', status: 'confirmed' }]
    }],
    consents: [],
    successAction: { type: 'message', message: 'Thanks' },
    routingPolicy: { type: 'single', adapterId: 'in_memory' }
  } as any;

  beforeEach(() => {
    registry = new TestRegistry();
    inMemoryAdapter = new InMemorySubmissionAdapter();
    registry.register(inMemoryAdapter);
    
    formRepo = new InMemoryFormSubmissionRepository();
    idemStore = new InMemoryIdempotencyStore();
    auditRepo = new InMemorySubmissionAuditRepository();
    
    const repos: SubmissionRepositories = { formSubmissions: formRepo, idempotency: idemStore, audit: auditRepo };
    uow = new DummyUnitOfWork(repos);
    clock = new MockClock();
    
    dispatcher = new SynchronousSubmissionDeliveryDispatcher(uow, registry, { timeoutMs: 50, maximumAttempts: 1 }, clock);
    
    service = new DefaultSubmissionService(
      uow,
      dispatcher,
      new MockIdGenerator(),
      clock,
      new MockPayloadHasher(),
      new MockSecurityPolicy()
    );
  });

  const createCommand = (key: string, routingPolicy: SubmissionRoutingPolicy = { type: 'single', adapterId: 'in_memory' }, securitySignals: any[] = []): SubmitFormCommand => {
    const f = { ...mockForm, routingPolicy } as any;
    return {
      form: f,
      payload: {
        fields: [{ fieldId: 'firstName', fieldType: 'text', value: 'John' }],
        consents: [],
        context: { validatedAt: new Date().toISOString() }
      },
      requestContext: {
        locale: 'en',
        route: '/',
        tenantId: 't1',
        receivedAt: new Date().toISOString(),
        requestId: 'req1',
        securitySignals
      },
      idempotencyKey: key
    };
  };

  it('1. Persists submission before adapter execution', async () => {
    // We override adapter to verify state BEFORE it finishes
    registry.register({
      id: 'internal',
      deliver: async (sub, cfg) => {
        const saved = await formRepo.findById(sub.submissionId);
        expect(saved).toBeDefined();
        expect(saved?.status).toBe('accepted');
        return { status: 'delivered', adapterId: 'internal', completedAt: new Date().toISOString() };
      }
    });

    const cmd = createCommand('key1', { type: 'single', adapterId: 'internal' });
    const res = await service.submitWithDispatch(cmd);
    
    expect(res.success).toBe(true);
    if (res.success) {
      const finalState = await formRepo.findById(res.submissionReference);
      expect(finalState?.status).toBe('delivered');
    }
  });

  it('2. Atomic Idempotency: Reuses result on identical payload hash', async () => {
    const cmd1 = createCommand('idem1');
    const res1 = await service.submitWithDispatch(cmd1);

    const cmd2 = createCommand('idem1');
    const res2 = await service.submitWithDispatch(cmd2); // same hash

    expect(res1).toEqual(res2);
    // Adapter called only once
    expect(inMemoryAdapter.deliveries.length).toBe(1);
    
    const audits = auditRepo.events.filter(e => e.event.type === 'idempotency_reused');
    expect(audits.length).toBe(1);
  });

  it('3. Atomic Idempotency: Conflict on different payload hash', async () => {
    const cmd1 = createCommand('idem_conflict');
    await service.submitWithDispatch(cmd1);

    const cmd2 = createCommand('idem_conflict');
    // Change payload to change hash
    (cmd2.payload.fields as any)[0].value = 'Jane';

    const res2 = await service.submitWithDispatch(cmd2);
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect(res2.error).toBe('duplicate_submission');
    }
  });

  it('4. Routing: Fan-out completely successful', async () => {
    inMemoryAdapter.setDefaultBehavior({ type: 'success' });
    // Register a second mock adapter
    const mock2 = new InMemorySubmissionAdapter();
    (mock2 as any).id = 'internal'; // pretend it's another one
    registry.register(mock2);

    const cmd = createCommand('fan1', { type: 'fan_out', adapterIds: ['in_memory', 'internal'] });
    const res = await service.submitWithDispatch(cmd);

    expect(res.success).toBe(true);
    const saved = await formRepo.findById((res as any).submissionReference);
    expect(saved?.status).toBe('delivered');
    expect(inMemoryAdapter.deliveries.length).toBe(1);
    expect(mock2.deliveries.length).toBe(1);
  });

  it('5. Routing: Fan-out partially successful', async () => {
    inMemoryAdapter.setDefaultBehavior({ type: 'success' });
    const mock2 = new InMemorySubmissionAdapter();
    (mock2 as any).id = 'internal';
    mock2.setDefaultBehavior({ type: 'permanent_failure', errorCode: 'vendor_error' });
    registry.register(mock2);

    const cmd = createCommand('fan2', { type: 'fan_out', adapterIds: ['in_memory', 'internal'] });
    const res = await service.submitWithDispatch(cmd);

    const saved = await formRepo.findById((res as any).submissionReference);
    expect(saved?.status).toBe('partially_delivered');
  });

  it('6. Security: Rejects honeypot internally and publicly correctly', async () => {
    const cmd = createCommand('hp1', { type: 'single', adapterId: 'in_memory' }, [{ type: 'honeypot_triggered', severity: 'high' }]);
    const res = await service.submitWithDispatch(cmd);
    
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toBe('submission_rejected');
    }
    
    // Nothing persisted
    expect(formRepo.store.size).toBe(0);
    expect(inMemoryAdapter.deliveries.length).toBe(0);
  });
});

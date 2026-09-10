import { describe, it, expect, vi } from 'vitest';
import { WebhookSubmissionAdapter } from '../WebhookSubmissionAdapter';
import { 
  WebhookAdapterConfiguration, 
  SafeOutboundHttpClient, 
  WebhookEndpointResolver, 
  CanonicalJsonSerializer,
  SafeOutboundHttpRequest,
  SafeOutboundHttpResponse
} from '../types';
import { 
  FormSubmission,
  ResolvedAdapterConfig, 
  DeliveryAttemptContext 
} from '../../../types';
import { AdapterSecretResolver } from '../../../ports/Secrets';
import { DefaultCanonicalJsonSerializer } from '../CanonicalJsonSerializer';
import { URL } from 'url';

class FakeHttpClient implements SafeOutboundHttpClient {
  public requests: SafeOutboundHttpRequest[] = [];
  public mockResponse: SafeOutboundHttpResponse = { statusCode: 200, headers: {} };
  public mockError?: Error;

  async execute(request: SafeOutboundHttpRequest): Promise<SafeOutboundHttpResponse> {
    this.requests.push(request);
    if (this.mockError) throw this.mockError;
    return this.mockResponse;
  }
}

class FakeEndpointResolver implements WebhookEndpointResolver {
  async resolve() {
    return { url: new URL('https://safe-endpoint.com/hook'), allowedHost: 'safe-endpoint.com' };
  }
}

class FakeSecretResolver implements AdapterSecretResolver {
  async resolve() {
    return "secret-token-123";
  }
}

describe('WebhookSubmissionAdapter', () => {
  const dummySubmission: FormSubmission = {
    submissionId: 'sub_1',
    requestId: 'req_1',
    formId: 'form_1',
    formVersion: '1.0',
    translationGroupId: 'tg_1',
    tenantId: 'tenant_1',
    locale: 'en',
    submittedAt: '2023-01-01T12:00:00Z',
    status: 'received',
    fields: [],
    consents: [],
    context: {}
  };

  const resolvedConfig: ResolvedAdapterConfig = {
    adapterId: 'webhook',
    enabled: true,
    fieldMappingId: 'map_1'
  };

  const attemptContext: DeliveryAttemptContext = {
    deliveryId: 'del_abc123',
    attempt: 1
  };

  const config: WebhookAdapterConfiguration = {
    adapterId: 'webhook',
    endpointReference: { key: 'test' },
    method: 'POST',
    contentType: 'application/json',
    fieldMappings: [],
    consentMappings: [],
    authentication: { type: 'bearer', secretReference: { key: 'sec', provider: 'environment' } },
    responsePolicy: { successStatusCodes: [200, 201], retryableStatusCodes: [429, 500, 503] },
    executionPolicy: { timeoutMs: 5000, maximumAttempts: 1 }
  };

  it('delivers payload and classifies success', async () => {
    const http = new FakeHttpClient();
    const adapter = new WebhookSubmissionAdapter(
      config,
      new FakeEndpointResolver(),
      new FakeSecretResolver(),
      http,
      new DefaultCanonicalJsonSerializer()
    );

    const result = await adapter.deliver(dummySubmission, resolvedConfig, attemptContext);

    expect(result.status).toBe('delivered');
    expect(http.requests.length).toBe(1);
    
    const req = http.requests[0];
    expect(req.url.href).toBe('https://safe-endpoint.com/hook');
    expect(req.headers['Authorization']).toBe('Bearer secret-token-123');
    expect(req.headers['X-TunerPortal-Delivery-Id']).toBe('del_abc123');
    
    const body = JSON.parse(req.body);
    expect(body.deliveryId).toBe('del_abc123');
  });

  it('classifies 429 as retryable', async () => {
    const http = new FakeHttpClient();
    http.mockResponse = { statusCode: 429, headers: { 'retry-after': '60' } };
    
    const adapter = new WebhookSubmissionAdapter(
      config,
      new FakeEndpointResolver(),
      new FakeSecretResolver(),
      http,
      new DefaultCanonicalJsonSerializer()
    );

    const result = await adapter.deliver(dummySubmission, resolvedConfig, attemptContext);

    expect(result.status).toBe('retryable_failure');
    expect((result as any).errorCode).toBe('rate_limit');
    expect((result as any).retryAfterSeconds).toBe(60);
  });

  it('handles client errors (e.g. timeout) safely', async () => {
    const http = new FakeHttpClient();
    http.mockError = new Error("Request Timeout");
    
    const adapter = new WebhookSubmissionAdapter(
      config,
      new FakeEndpointResolver(),
      new FakeSecretResolver(),
      http,
      new DefaultCanonicalJsonSerializer()
    );

    const result = await adapter.deliver(dummySubmission, resolvedConfig, attemptContext);

    expect(result.status).toBe('retryable_failure');
    expect((result as any).errorCode).toBe('timeout');
  });
});

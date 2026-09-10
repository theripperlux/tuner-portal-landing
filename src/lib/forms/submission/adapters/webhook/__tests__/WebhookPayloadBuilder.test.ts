import { describe, it, expect } from 'vitest';
import { WebhookPayloadBuilder } from '../WebhookPayloadBuilder';
import { WebhookAdapterConfiguration } from '../types';
import { FormSubmission } from '../../../types';

describe('WebhookPayloadBuilder', () => {
  const dummySubmission: FormSubmission = {
    submissionId: 'sub_123',
    requestId: 'req_1',
    formId: 'form_123',
    formVersion: '1.0',
    translationGroupId: 'tg_1',
    tenantId: 'tenant_1',
    locale: 'de',
    submittedAt: '2023-01-01T12:00:00Z',
    fields: [
      { fieldId: 'first_name', fieldType: 'text', value: 'Alice' },
      { fieldId: 'age', fieldType: 'number', value: 30 },
      { fieldId: 'secret_note', fieldType: 'text', value: 'do not leak' }
    ],
    consents: [
      { consentId: 'tos', purpose: 'privacy', documentRef: 'doc_1', accepted: true, acceptedAt: '2023-01-01T12:00:00Z', version: 'v1' }
    ],
    context: {
      userAgent: 'MockAgent'
    },
    status: 'received'
  };

  it('maps fields and consents securely avoiding PII by default', () => {
    const config: WebhookAdapterConfiguration = {
      adapterId: 'webhook',
      endpointReference: { key: 'test' },
      method: 'POST',
      contentType: 'application/json',
      fieldMappings: [
        { sourceFieldId: 'first_name', targetField: 'name', required: true },
        { sourceFieldId: 'age', targetField: 'userAge', required: false }
        // secret_note is intentionally omitted
      ],
      consentMappings: [
        { consentId: 'tos', targetField: 'acceptedTos', valueMode: 'accepted_boolean' }
      ],
      authentication: { type: 'none' },
      responsePolicy: { successStatusCodes: [200], retryableStatusCodes: [] },
      executionPolicy: { timeoutMs: 5000, maximumAttempts: 1 }
    };

    const envelope = WebhookPayloadBuilder.build(dummySubmission, config);

    // Assert Envelope Core
    expect(envelope.schemaVersion).toBe('1');
    expect(envelope.tenant.tenantId).toBe('tenant_1');
    expect(envelope.deliveryId).toBe('sub_123');
    
    // Assert Mapped Fields
    expect(envelope.submission.fields['name']).toBe('Alice');
    expect(envelope.submission.fields['userAge']).toBe(30);
    expect(envelope.submission.fields['secret_note']).toBeUndefined();

    // Assert Mapped Consents
    expect(envelope.submission.consents['acceptedTos']).toBe(true);
  });

  it('prevents prototype pollution in mapping targets', () => {
    const config: WebhookAdapterConfiguration = {
      adapterId: 'webhook',
      endpointReference: { key: 'test' },
      method: 'POST',
      contentType: 'application/json',
      fieldMappings: [
        { sourceFieldId: 'first_name', targetField: '__proto__', required: true }
      ],
      consentMappings: [],
      authentication: { type: 'none' },
      responsePolicy: { successStatusCodes: [200], retryableStatusCodes: [] },
      executionPolicy: { timeoutMs: 5000, maximumAttempts: 1 }
    };

    expect(() => WebhookPayloadBuilder.build(dummySubmission, config))
      .toThrow("Duplicate target mapping detected for '__proto__'");
  });
});

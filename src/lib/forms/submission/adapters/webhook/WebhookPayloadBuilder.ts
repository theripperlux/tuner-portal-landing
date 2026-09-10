import { FormSubmission } from '../../types';
import { FieldMapper } from '../../FieldMapper';
import { WebhookPayloadEnvelope, WebhookPayloadValue, WebhookConsentValue, WebhookAdapterConfiguration } from './types';

export class WebhookPayloadBuilder {
  /**
   * Creates a structured WebhookPayloadEnvelope using explicitly mapped data.
   */
  public static build(
    submission: FormSubmission,
    config: WebhookAdapterConfiguration
  ): WebhookPayloadEnvelope {
    
    // 1. Map core fields via FieldMapper
    const mappedFields = FieldMapper.mapFields(submission.fields, config.fieldMappings);

    // Filter output to primitive WebhookPayloadValue types and verify no blacklisted keys
    const safeFields: Record<string, WebhookPayloadValue> = Object.create(null);
    
    for (const [key, value] of Object.entries(mappedFields)) {
      if (this.isSafeKey(key) && this.isValidPayloadValue(value)) {
        safeFields[key] = value;
      }
    }

    // 2. Map Consents
    const safeConsents: Record<string, WebhookConsentValue> = Object.create(null);
    for (const consentMapping of config.consentMappings) {
      if (!this.isSafeKey(consentMapping.targetField)) continue;
      
      const consent = submission.consents?.find(c => c.consentId === consentMapping.consentId);
      if (!consent) continue; // If not found/accepted, don't map it. Or map as false if mode requires it? 
      // Rule: Data minimization. Only send what exists.

      let targetValue: WebhookConsentValue | null = null;
      switch (consentMapping.valueMode) {
        case "accepted_boolean":
          targetValue = consent.accepted;
          break;
        case "accepted_timestamp":
          targetValue = consent.acceptedAt;
          break;
        case "version":
          targetValue = consent.version;
          break;
        case "document_reference":
          targetValue = consent.documentRef;
          break;
      }

      if (targetValue !== null && typeof targetValue !== 'undefined') {
        safeConsents[consentMapping.targetField] = targetValue;
      }
    }

    // 3. Build Envelope
    const envelope: WebhookPayloadEnvelope = {
      schemaVersion: "1",
      eventType: "form.submission.accepted",
      deliveryId: submission.submissionId, // Can be overridden during dispatch if retrying
      occurredAt: submission.submittedAt,
      tenant: {
        tenantId: submission.tenantId,
        whiteLabelId: undefined // Could be added to FormSubmission later
      },
      form: {
        formId: submission.formId,
        formVersion: submission.formVersion,
        translationGroupId: submission.translationGroupId,
        locale: submission.locale
      },
      submission: {
        publicReference: submission.submissionId, // Could be a separate public ID later
        submittedAt: submission.submittedAt,
        fields: safeFields,
        consents: safeConsents
      }
    };

    return envelope;
  }

  private static isSafeKey(key: string): boolean {
    return !/^(__proto__|prototype|constructor)$/.test(key);
  }

  private static isValidPayloadValue(value: any): value is WebhookPayloadValue {
    if (value === null) return true;
    const t = typeof value;
    if (t === 'string' || t === 'number' || t === 'boolean') return true;
    if (Array.isArray(value)) {
      return value.every(item => typeof item === 'string'); // Only array of strings
    }
    return false;
  }
}

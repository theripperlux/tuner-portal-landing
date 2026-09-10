import { LeadCaptureFormModule } from '@/types/modules';
import { ValidatedFormPayload, SubmittedFieldValue, ConsentPurpose, SubmittedConsent } from '../types';
export type { ValidatedFormPayload, SubmittedFieldValue, ConsentPurpose, SubmittedConsent };

// ============================================================================
// 1. Trusted Request Context
// ============================================================================

export type TrustedCampaignContext = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type SubmissionSecuritySignal =
  | { type: "honeypot_triggered"; severity: "high" }
  | { type: "submission_too_fast"; severity: "medium" }
  | { type: "rate_limit_exceeded"; severity: "high" };

export type TrustedRequestContext = {
  locale: string;
  route: string;
  tenantId: string;
  whiteLabelId?: string;
  receivedAt: string;
  requestId: string;
  userAgent?: string;
  referrer?: string;
  ipHash?: string;
  campaign?: TrustedCampaignContext;
  securitySignals: readonly SubmissionSecuritySignal[];
};

// ============================================================================
// 2. Submission Model (Immutable Snapshot)
// ============================================================================

export type SubmissionContext = {
  campaign?: TrustedCampaignContext;
  userAgent?: string;
  referrer?: string;
};

export type FormSubmissionStatus =
  | "received"
  | "validated"
  | "accepted"
  | "delivery_pending"
  | "partially_delivered"
  | "delivered"
  | "failed"
  | "rejected";

export type FormSubmission = {
  submissionId: string;
  requestId: string;
  formId: string;
  formVersion: string;
  translationGroupId: string;
  tenantId: string;
  locale: string;
  submittedAt: string;
  status: FormSubmissionStatus;
  fields: readonly SubmittedFieldValue[];
  consents: readonly SubmittedConsent[];
  context: SubmissionContext;
};

// ============================================================================
// 3. Command and Service Interface
// ============================================================================

export type SubmitFormCommand = {
  form: LeadCaptureFormModule;
  payload: ValidatedFormPayload;
  requestContext: TrustedRequestContext;
  idempotencyKey: string;
};

export type SubmitFormPublicResponse =
  | {
      success: true;
      status: "accepted";
      submissionReference: string;
      successActionId?: string;
    }
  | {
      success: false;
      error:
        | "validation_error"
        | "submission_rejected"
        | "duplicate_submission"
        | "rate_limited"
        | "temporarily_unavailable";
      messageId: string;
    };

export interface FormSubmissionService {
  submit(command: SubmitFormCommand): Promise<SubmitFormPublicResponse>;
}

// ============================================================================
// 4. Adapters and Configuration
// ============================================================================

export type AdapterId = "in_memory" | "internal" | "webhook";

export type SubmissionRoutingPolicy =
  | { type: "single"; adapterId: AdapterId }
  | { type: "fan_out"; adapterIds: readonly [AdapterId, ...AdapterId[]] }
  | { type: "primary_with_fallback"; primaryAdapterId: AdapterId; fallbackAdapterIds: readonly AdapterId[] };

export type AdapterConfiguration = {
  adapterId: AdapterId;
  enabled: boolean;
  fieldMappingId: string;
};

export type AdapterErrorCode = 
  | "timeout" 
  | "rate_limit" 
  | "unauthorized" 
  | "forbidden"
  | "invalid_mapping" 
  | "invalid_endpoint"
  | "blocked_endpoint"
  | "payload_too_large"
  | "invalid_response"
  | "vendor_error"
  | "network_error"
  | "signing_failed"
  | "secret_resolution_failed";

export type AdapterSkipReason = 
  | "disabled" 
  | "condition_not_met" 
  | "missing_secret";

export type AdapterDeliveryResult =
  | { status: "delivered"; adapterId: AdapterId; externalReference?: string; completedAt: string }
  | { status: "retryable_failure"; adapterId: AdapterId; errorCode: AdapterErrorCode; retryAfterSeconds?: number; completedAt: string }
  | { status: "permanent_failure"; adapterId: AdapterId; errorCode: AdapterErrorCode; completedAt: string }
  | { status: "skipped"; adapterId: AdapterId; reason: AdapterSkipReason; completedAt: string };

export type ResolvedAdapterConfig = {
  adapterId: AdapterId;
  enabled: boolean;
  fieldMappingId: string;
};

export type DeliveryAttemptContext = {
  deliveryId: string;
  attempt: number;
};

export interface FormSubmissionAdapter {
  readonly id: AdapterId;
  deliver(submission: FormSubmission, config: ResolvedAdapterConfig, context?: DeliveryAttemptContext): Promise<AdapterDeliveryResult>;
}

export type AdapterResolutionResult =
  | { success: true; adapter: FormSubmissionAdapter }
  | { success: false; error: "adapter_not_registered" };

export interface AdapterRegistry {
  register(adapter: FormSubmissionAdapter): void;
  getAdapter(id: AdapterId): FormSubmissionAdapter | undefined;
  resolveAdapter(id: AdapterId): AdapterResolutionResult;
}

// ============================================================================
// 5. Field Mapping
// ============================================================================

export type DateOutputFormat =
  | "iso_date"
  | "iso_datetime"
  | "unix_seconds"
  | "unix_milliseconds";

export type FieldTransform =
  | { type: "identity" }
  | { type: "join"; delimiter: string }
  | { type: "lowercase" }
  | { type: "uppercase" }
  | { type: "boolean_to_string"; trueValue: string; falseValue: string }
  | { type: "date_format"; format: DateOutputFormat }
  | { type: "country_code"; format: "alpha-2" | "alpha-3" }
  | { type: "static_value"; value: string };

export type SubmissionFieldMapping = {
  sourceFieldId: string;
  targetField: string;
  transform?: FieldTransform;
  required: boolean;
};

export type ConsentFieldMapping = {
  consentId: string;
  targetField: string;
  valueMode:
    | "accepted_boolean"
    | "accepted_timestamp"
    | "version"
    | "document_reference";
};

// ============================================================================
// 6. Audit & Analytics
// ============================================================================

export type DurationBucket =
  | "under_10_seconds"
  | "10_to_30_seconds"
  | "30_to_60_seconds"
  | "1_to_3_minutes"
  | "over_3_minutes";

export type SubmissionAuditEventType = 
  | "submission_received"
  | "submission_validated"
  | "submission_accepted"
  | "submission_rejected"
  | "delivery_scheduled"
  | "submission_status_changed"
  | "idempotency_reused"
  | "idempotency_conflict"
  | "adapter_delivery_started"
  | "adapter_delivery_completed"
  | "adapter_delivery_failed";

export type SubmissionAuditEvent = {
  type: SubmissionAuditEventType;
  occurredAt: string;
  [key: string]: unknown; // Payload-Restriktion passiert via Repository (kein PII, Raw-Payloads oder Secrets)
};

export type FormAnalyticsEvent = {
  eventType: "form_viewed" | "form_started" | "form_submitted" | "form_rejected";
  formId: string;
  formVersion: string;
  stepId?: string;
  validationErrorCode?: string;
  durationBucket?: DurationBucket;
};

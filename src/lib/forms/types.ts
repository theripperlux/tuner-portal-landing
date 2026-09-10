import { z } from 'zod';
import { LeadCaptureFormModule } from '@/types/modules';

/**
 * Der rohe Formular-Payload, wie er vom Browser/Client kommt.
 * Darf niemals ungeprüft vertraut werden.
 */
export type RawFormPayload = Record<string, unknown>;

export type NormalizedFormValue = string | number | boolean | readonly string[] | null;

export type SubmittedFieldValue =
  | { fieldId: string; fieldType: "text" | "textarea" | "email" | "tel" | "url"; value: string }
  | { fieldId: string; fieldType: "number"; value: number }
  | { fieldId: string; fieldType: "checkbox" | "switch"; value: boolean }
  | { fieldId: string; fieldType: "select" | "radio" | "country" | "language" | "timezone"; value: string }
  | { fieldId: string; fieldType: "multiselect"; value: readonly string[] }
  | { fieldId: string; fieldType: "date" | "datetime"; value: string };

export type ConsentPurpose =
  | "privacy"
  | "marketing"
  | "newsletter"
  | "tracking"
  | "third_party"
  | "profiling";

export interface SubmittedConsent {
  consentId: string;
  purpose: ConsentPurpose;
  version: string;
  documentRef: string;
  accepted: boolean;
  acceptedAt: string;
}

export type FormValidationIssueCode =
  | 'required'
  | 'invalid_type'
  | 'invalid_format'
  | 'too_short'
  | 'too_long'
  | 'below_minimum'
  | 'above_maximum'
  | 'invalid_option'
  | 'inactive_field'
  | 'unknown_field'
  | 'dependency_failed'
  | 'consent_required'
  | 'consent_version_mismatch'
  | 'duplicate_value'
  | 'custom_validation_failed';

export interface FormValidationIssue {
  code: FormValidationIssueCode;
  fieldId?: string;
  consentId?: string;
  messageId: string;
  path: readonly (string | number)[];
  metadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ValidatedFormPayload {
  fields: readonly SubmittedFieldValue[];
  consents: readonly SubmittedConsent[];
  context: {
    // Only generated on the server after successful validation
    validatedAt: string;
  };
}

export type FormPayloadValidationResult =
  | {
      success: true;
      data: ValidatedFormPayload;
    }
  | {
      success: false;
      errors: readonly FormValidationIssue[];
    };

export type FormPayloadSchemaFactoryOptions = {
  locale: string;
  mode: 'public' | 'preview' | 'auth';
  now?: Date;
};

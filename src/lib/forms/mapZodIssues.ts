import { z } from 'zod';
import { FormValidationIssue, FormValidationIssueCode } from './types';

/**
 * Übersetzt ein Zod-Issue in ein standardisiertes FormValidationIssue.
 */
export function mapZodIssue(issue: z.ZodIssue): FormValidationIssue {
  let code: FormValidationIssueCode = 'invalid_format';
  let messageId = 'errors.invalid_format';
  const path = issue.path;

  // Extrahiere fieldId oder consentId aus dem Path, falls vorhanden
  // Wir erwarten typischerweise Pfade wie ["fields", "f1", "value"] oder ["consents", "c1", "accepted"]
  let fieldId: string | undefined;
  let consentId: string | undefined;

  if (path.length >= 2) {
    if (path[0] === 'fields') {
      fieldId = String(path[1]);
    } else if (path[0] === 'consents') {
      consentId = String(path[1]);
    } else if (path[0] === 'security') {
      fieldId = 'security';
    }
  }

  // Für simple direct objects z.B. Record<string, unknown>
  if (path.length === 1 && typeof path[0] === 'string') {
    fieldId = path[0];
  }

  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      const msg = issue.message || '';
      if (msg.includes('received undefined') || msg.includes('received null')) {
        code = 'required';
        messageId = 'errors.required';
      } else {
        code = 'invalid_type';
        messageId = 'errors.invalid_type';
      }
      break;
    case z.ZodIssueCode.too_small:
      const minOrigin = (issue as any).origin || (issue as any).type;
      if (minOrigin === 'string') {
        code = issue.minimum === 1 ? 'required' : 'too_short';
        messageId = issue.minimum === 1 ? 'errors.required' : 'errors.too_short';
      } else if (minOrigin === 'number') {
        code = 'below_minimum';
        messageId = 'errors.below_minimum';
      } else if (minOrigin === 'array') {
        code = issue.minimum === 1 ? 'required' : 'too_short';
        messageId = issue.minimum === 1 ? 'errors.required' : 'errors.too_short';
      }
      break;
    case z.ZodIssueCode.too_big:
      const maxOrigin = (issue as any).origin || (issue as any).type;
      if (maxOrigin === 'string' || maxOrigin === 'array') {
        code = 'too_long';
        messageId = 'errors.too_long';
      } else if (maxOrigin === 'number') {
        code = 'above_maximum';
        messageId = 'errors.above_maximum';
      }
      break;
    case (z.ZodIssueCode as any).invalid_enum_value:
    case 'invalid_value':
      code = 'invalid_option';
      messageId = 'errors.invalid_option';
      break;
    case z.ZodIssueCode.unrecognized_keys:
      code = 'unknown_field';
      messageId = 'errors.unknown_field';
      break;
    case z.ZodIssueCode.custom:
      // Wir können eigene Codes über issue.params.code transportieren
      if (issue.params && issue.params.code) {
        code = issue.params.code as FormValidationIssueCode;
        messageId = issue.params.messageId || `errors.${code}`;
      } else {
        code = 'custom_validation_failed';
        messageId = 'errors.custom_validation_failed';
      }
      break;
    case z.ZodIssueCode.invalid_format:
    case (z.ZodIssueCode as any).invalid_string:
      code = 'invalid_format';
      messageId = 'errors.invalid_format';
      break;
  }

  // Erlaube Fallback auf die von Zod gelieferte Message, falls wir sie spezifisch gesetzt haben
  if (issue.message && issue.message !== 'Required' && issue.message !== 'Invalid input') {
    // Wenn die Zod-Message bereits aussieht wie ein Translation-Key
    if (issue.message.startsWith('errors.')) {
      messageId = issue.message;
    }
  }

  return {
    code,
    fieldId,
    consentId,
    messageId,
    path: issue.path as (string | number)[]
  };
}

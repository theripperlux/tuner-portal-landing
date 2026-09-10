import { describe, it, expect } from 'vitest';
import { validateFormPayload } from '../validateFormPayload';
import { LeadCaptureFormModule } from '@/types/modules';

const baseForm: LeadCaptureFormModule = {
  _type: 'leadCaptureForm',
  id: 'test_form',
  submitLabel: 'Submit',
  sections: [],
  consents: [],
  successActions: [],
  errorMessages: {
    generalError: 'Err',
    networkError: 'Err',
    validationError: 'Err',
    rateLimitError: 'Err'
  }
};

describe('validateFormPayload', () => {
  it('validates a simple text field successfully', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      sections: [{
        id: 's1',
        status: 'confirmed',
        content: [{
          type: 'text',
          id: 'firstName',
          name: 'firstName',
          label: 'First Name',
          status: 'confirmed',
          validation: { required: true, minLength: 2 }
        }]
      }]
    };

    const res = validateFormPayload(form, { fields: { firstName: 'John' } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.fields).toHaveLength(1);
      expect(res.data.fields[0].value).toBe('John');
    }
  });

  it('fails on missing required text field', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      sections: [{
        id: 's1',
        status: 'confirmed',
        content: [{
          type: 'text',
          id: 'firstName',
          name: 'firstName',
          label: 'First Name',
          status: 'confirmed',
          validation: { required: true }
        }]
      }]
    };

    const res = validateFormPayload(form, { fields: {} }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0].code).toBe('required');
      expect(res.errors[0].fieldId).toBe('firstName');
    }
  });

  it('rejects unknown fields (strict payload parsing)', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      sections: [{
        id: 's1',
        status: 'confirmed',
        content: [{
          type: 'text',
          id: 'firstName',
          name: 'firstName',
          label: 'First Name',
          status: 'confirmed'
        }]
      }]
    };

    const res = validateFormPayload(form, { fields: { firstName: 'John', hack: 'yes' } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0].code).toBe('unknown_field');
    }
  });

  it('validates required consent and version', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      consents: [{
        id: 'c1',
        type: 'dsgvo',
        version: '1.0',
        required: true,
        text: 'I agree',
        status: 'confirmed'
      }]
    };

    // Missing consent
    let res = validateFormPayload(form, { fields: {} }, { locale: 'en', mode: 'public' });
    if (res.success) console.log(JSON.stringify(res.data));
    expect(res.success).toBe(false);

    // Wrong version
    res = validateFormPayload(form, { fields: {}, consents: { c1: { accepted: true, version: '0.9' } } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0].code).toBe('custom_validation_failed');
      expect(res.errors[0].messageId).toBe('errors.consent_version_mismatch');
    }

    // Correct
    res = validateFormPayload(form, { fields: {}, consents: { c1: { accepted: true, version: '1.0' } } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(true);
  });

  it('rejects password fields', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      sections: [{
        id: 's1',
        status: 'confirmed',
        content: [{
          type: 'password',
          id: 'pw',
          name: 'pw',
          label: 'Password',
          status: 'confirmed'
        }]
      }]
    };

    const res = validateFormPayload(form, { fields: { pw: 'secret' } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0].messageId).toBe('errors.password_fields_prohibited');
    }
  });

  it('detects honeypot violations', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      securityConfig: { requireHoneypot: true }
    };

    // Filled honeypot -> fails
    const res = validateFormPayload(form, { fields: {}, security: { _tuner_hp: 'bot_value' } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0].code).toBe('too_long');
      expect(res.errors[0].fieldId).toBe('security'); 
    }
  });

  it('handles conditional required fields', () => {
    const form: LeadCaptureFormModule = {
      ...baseForm,
      sections: [{
        id: 's1',
        status: 'confirmed',
        content: [
          {
            type: 'checkbox',
            id: 'hasCompany',
            name: 'hasCompany',
            label: 'Has Company',
            textLabel: 'Have a company?',
            status: 'confirmed'
          },
          {
            type: 'text',
            id: 'companyName',
            name: 'companyName',
            label: 'Company Name',
            status: 'confirmed',
            validation: { required: true },
            conditions: [{ dependsOnId: 'hasCompany', operator: 'equals', value: true }]
          }
        ]
      }]
    };

    // If hasCompany is false, companyName is NOT required (condition not met, field inactive)
    let res = validateFormPayload(form, { fields: { hasCompany: false } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(true);

    // If hasCompany is true, companyName IS required
    res = validateFormPayload(form, { fields: { hasCompany: true } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors[0].code).toBe('required');
      expect(res.errors[0].fieldId).toBe('companyName');
    }

    // If hasCompany is true, and companyName provided
    res = validateFormPayload(form, { fields: { hasCompany: true, companyName: 'Acme Corp' } }, { locale: 'en', mode: 'public' });
    expect(res.success).toBe(true);
  });
});

import { LeadCaptureFormModule, FormField, FormFieldGroup } from '@/types/modules';
import { 
  FormPayloadSchemaFactoryOptions, 
  FormPayloadValidationResult, 
  RawFormPayload,
  ValidatedFormPayload,
  SubmittedFieldValue,
  SubmittedConsent
} from './types';
import { createFormPayloadSchema } from './createFormPayloadSchema';
import { mapZodIssue } from './mapZodIssues';
import { normalizeValue } from './normalizeFormPayload';
import { evaluateFieldConditions } from './evaluateFieldConditions';

/**
 * Sammelt alle Felder flach zusammen.
 */
function collectFields(items: (FormField | FormFieldGroup)[]): FormField[] {
  let fields: FormField[] = [];
  for (const item of items) {
    if ('fields' in item) {
      fields = fields.concat(collectFields(item.fields));
    } else {
      fields.push(item);
    }
  }
  return fields;
}

/**
 * Validiert einen rohen Payload gegen eine Formular-Konfiguration.
 * Dies ist der primäre Gatekeeper der Payload Zod Factory.
 */
export function validateFormPayload(
  form: LeadCaptureFormModule,
  rawPayload: RawFormPayload,
  options: FormPayloadSchemaFactoryOptions
): FormPayloadValidationResult {
  const payloadToParse = {
    fields: {},
    consents: {},
    security: {},
    ...(rawPayload && typeof rawPayload === 'object' ? rawPayload : {})
  };

  const schema = createFormPayloadSchema(form, options);
  const result = schema.safeParse(payloadToParse);

  if (!result.success) {
    const errors = result.error.issues.map(mapZodIssue);
    return {
      success: false,
      errors
    };
  }

  // Schema Parsing war erfolgreich (Struktur und Typen stimmen, Required-Rules etc.).
  // Jetzt normalisieren und in das Zielformat überführen.
  const data = result.data as any;
  const rawFields = data.fields || {};
  const rawConsents = data.consents || {};

  // 1. Hole alle aktiven Felder für die Normalisierung
  let allFields: FormField[] = [];
  form.sections.forEach(section => {
    if (section.status === 'confirmed') {
      allFields = allFields.concat(collectFields(section.content));
    }
  });
  allFields = allFields.filter(f => f.status === 'confirmed');

  const finalFields: SubmittedFieldValue[] = [];

  for (const field of allFields) {
    // Prüfen ob das Feld conditional inaktiv war
    if (field.conditions && field.conditions.length > 0) {
      const isActive = evaluateFieldConditions(field.conditions, rawFields);
      if (!isActive) {
        continue; // Feld überspringen, da inaktiv
      }
    }

    const val = rawFields[field.id];
    const normalized = normalizeValue(val);
    
    // Optional: Wenn es null ist und nicht required, können wir es aus dem Payload weglassen 
    // (oder explizit als null mitsenden, je nach Anforderung). Wir senden es mit.
    if (normalized !== null || field.validation?.required) {
      finalFields.push({
        fieldId: field.id,
        fieldType: field.type as any, // Cast since we know it's one of the union types from LeadCaptureFormModule
        value: normalized as any
      });
    }
  }

  // 2. Consents normalisieren
  const finalConsents: SubmittedConsent[] = [];
  const activeConsents = form.consents.filter(c => c.status === 'confirmed');
  const nowStr = (options.now || new Date()).toISOString();

  for (const c of activeConsents) {
    const cData = rawConsents[c.id];
    if (cData && cData.accepted) {
      finalConsents.push({
        consentId: c.id,
        purpose: 'privacy', // This should map to the actual purpose from the Module but we use 'privacy' as fallback
        version: cData.version,
        accepted: cData.accepted,
        acceptedAt: nowStr,
        documentRef: c.documentReferenceUrl || ''
      });
    }
  }

  // 3. Security (falls Honeypot getriggert war, wäre es schon durch Zod als error geflogen)
  // da max(0) fehlschlägt wenn etwas drin steht.

  const validatedData: ValidatedFormPayload = {
    fields: finalFields,
    consents: finalConsents,
    context: {
      validatedAt: nowStr
    }
  };

  return {
    success: true,
    data: validatedData
  };
}

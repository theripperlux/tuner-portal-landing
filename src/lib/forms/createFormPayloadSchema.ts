import { z } from 'zod';
import { 
  LeadCaptureFormModule, 
  FormField, 
  FormFieldGroup, 
  BaseFormField 
} from '@/types/modules';
import { FormPayloadSchemaFactoryOptions, ValidatedFormPayload } from './types';
import { customValidators } from './customValidatorRegistry';
import { evaluateFieldConditions } from './evaluateFieldConditions';
import { normalizeValue } from './normalizeFormPayload';

/**
 * Erzeugt für ein einzelnes Feld den passenden ZodType.
 */
function createZodSchemaForField(field: FormField): z.ZodTypeAny {
  const req = field.validation?.required ?? false;
  let schema: z.ZodTypeAny;

  const getCustomError = (key: string) => {
    return field.validation?.errorMessageOverrides?.[key] || undefined;
  };

  switch (field.type) {
    case 'text':
    case 'company':
    case 'vat':
      let stringSchema = z.string();
      if (field.validation?.minLength) stringSchema = stringSchema.min(field.validation.minLength, getCustomError('too_short'));
      if (field.validation?.maxLength) stringSchema = stringSchema.max(field.validation.maxLength, getCustomError('too_long'));
      if (field.validation?.regex) stringSchema = stringSchema.regex(new RegExp(field.validation.regex), getCustomError('invalid_format'));
      schema = stringSchema;
      break;

    case 'textarea':
      let taSchema = z.string();
      if (field.validation?.minLength) taSchema = taSchema.min(field.validation.minLength, getCustomError('too_short'));
      if (field.validation?.maxLength) taSchema = taSchema.max(field.validation.maxLength, getCustomError('too_long'));
      schema = taSchema;
      break;

    case 'email':
      schema = z.string().email(getCustomError('invalid_format'));
      break;

    case 'url':
      schema = z.string().url(getCustomError('invalid_format'))
      .refine(val => {
        try {
          const url = new URL(val);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      }, { message: getCustomError('invalid_format') || 'errors.invalid_url_protocol' });
      break;

    case 'tel':
      schema = z.string().min(6, getCustomError('too_short')).max(30, getCustomError('too_long'));
      break;

    case 'number':
      let numSchema = z.number();
      if (field.validation?.min !== undefined) numSchema = numSchema.min(field.validation.min, getCustomError('below_minimum'));
      if (field.validation?.max !== undefined) numSchema = numSchema.max(field.validation.max, getCustomError('above_maximum'));
      // Optional: Check if integer requested (could check field.step === 1 etc.)
      schema = numSchema;
      break;

    case 'select':
    case 'radio':
      const validOptions = field.options.filter(o => o.status === 'confirmed').map(o => o.value);
      if (validOptions.length === 0) {
        // Fallback falls keine Optionen da sind - sollte eigentlich von Publishability abgefangen werden
        schema = z.string().refine(() => false, { message: 'errors.no_options_available' });
      } else {
        schema = z.enum(validOptions as [string, ...string[]]);
      }
      break;

    case 'multiselect':
      const mOptions = field.options.filter(o => o.status === 'confirmed').map(o => o.value);
      let arrSchema = z.array(z.enum(mOptions as [string, ...string[]]));
      if (field.minSelection) arrSchema = arrSchema.min(field.minSelection, getCustomError('too_short'));
      if (field.maxSelection) arrSchema = arrSchema.max(field.maxSelection, getCustomError('too_long'));
      schema = arrSchema;
      break;

    case 'checkbox':
    case 'switch':
      schema = z.boolean();
      break;

    case 'country':
    case 'language':
    case 'timezone':
    case 'date':
    case 'datetime':
      // Simplified: Just generic strings for now. Real world would strictly validate ISO dates or IANA zones.
      schema = z.string();
      break;

    case 'hidden':
      // Hidden fields expected from frontend usually reflect a static value or a dynamic param.
      // Often better to inject them via backend context rather than trust the frontend.
      schema = z.string().optional();
      break;

    case 'password':
      // Wir lehnen Passwörter standardmäßig ab (Security Boundary),
      // außer es gibt ein spezielles Opt-In, das wir hier aber strikt blockieren.
      schema = z.any().refine(() => false, { message: 'errors.password_fields_prohibited' });
      break;

    default:
      schema = z.any();
  }

  // Custom Validator anwenden (synchron)
  if (field.validation?.customValidatorId) {
    const customVal = customValidators[field.validation.customValidatorId as keyof typeof customValidators];
    if (customVal) {
      schema = schema.refine(val => customVal(val), {
        message: getCustomError('custom_validation_failed') || `errors.custom_${field.validation.customValidatorId}`,
        params: { code: 'custom_validation_failed' }
      });
    }
  }

  // Wenn nicht required oder das Feld Bedingungen hat (wird dynamisch geprüft), mach es optional
  if (!req || (field.conditions && field.conditions.length > 0)) {
    if (schema instanceof z.ZodString) {
      // ZodString handles empty string badly for optional, we want empty string to be optional too
      return schema.optional().or(z.literal(''));
    }
    return schema.optional();
  }

  return schema;
}

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
 * Erzeugt das finale Zod Schema für die Payload Validierung.
 */
export function createFormPayloadSchema(
  form: LeadCaptureFormModule,
  options: FormPayloadSchemaFactoryOptions
) {
  // 1. Alle FormFields extrahieren
  let allFields: FormField[] = [];
  form.sections.forEach(section => {
    if (section.status === 'confirmed') {
      allFields = allFields.concat(collectFields(section.content));
    }
  });

  // Nur confirmed Felder (oder je nach Option mode)
  allFields = allFields.filter(f => f.status === 'confirmed');

  // 2. Felder-Schema bauen
  const fieldsShape: Record<string, z.ZodTypeAny> = {};
  allFields.forEach(field => {
    fieldsShape[field.id] = createZodSchemaForField(field);
  });

  const rawFieldsSchema = z.object(fieldsShape).strict();

  // 3. Consent Schema bauen
  const consentShape: Record<string, z.ZodTypeAny> = {};
  const activeConsents = form.consents.filter(c => c.status === 'confirmed');
  console.log('activeConsents', activeConsents.length);
  
  activeConsents.forEach(c => {
    const cShape = z.object({
      version: z.string().refine(v => v === c.version, { message: 'errors.consent_version_mismatch' }),
      accepted: c.required ? z.boolean().refine(v => v === true, { message: 'errors.consent_required' }) : z.boolean()
    });
    consentShape[c.id] = cShape;
  });

  const consentsSchema = z.object(consentShape).strict();

  // 4. Security (Honeypot etc.)
  const securityShape: Record<string, z.ZodTypeAny> = {};
  if (form.securityConfig?.requireHoneypot) {
    // Das Honeypot-Feld muss leer sein. Wenn es gefüllt ist -> Spam.
    // Wir nennen es z.B. "_tuner_hp" (dieser Key wird in validateFormPayload konfiguriert)
    securityShape['_tuner_hp'] = z.string().max(0, { message: 'errors.invalid_format' }).optional();
  }

  const securitySchema = z.object(securityShape).strict();

  // 5. Finales Basis-Schema kombinieren
  const baseSchema = z.object({
    fields: rawFieldsSchema,
    consents: consentsSchema,
    security: securitySchema
  }).strict();

  // 6. SuperRefine für Conditional Logic
  // Wenn ein Feld von einer Condition abhängt, dann prüfen wir hier dynamisch:
  // Ist das Feld inaktiv? -> Wert ignorieren/löschen.
  // Ist es aktiv und required? -> Darf nicht leer sein.
  return baseSchema.superRefine((data, ctx) => {
    const payloadFields = (data.fields || {}) as Record<string, unknown>;

    allFields.forEach(field => {
      // Falls es Conditions gibt, auswerten
      if (field.conditions && field.conditions.length > 0) {
        const isActive = evaluateFieldConditions(field.conditions, payloadFields);
        
        if (!isActive) {
          // Feld ist inaktiv, sollte eigentlich gar nicht übertragen werden oder wird ignoriert.
          // Optional: Wenn es doch übertragen wurde und wir strikt sein wollen, geben wir hier keinen Fehler,
          // sondern verwerfen es in der Normalisierungsschicht.
        } else {
          // Feld ist aktiv. Wenn es required ist, prüfen ob es leer ist.
          // Normalerweise fängt das normale Schema required ab, aber wenn wir ein Feld 
          // durch Conditional Logic dynamisch required machen (bzw. sein Basis-Schema ist optional und erst hier required),
          // dann müssten wir es hier checken.
          // DA wir aber das Basis-Schema immer als `optional()` definieren müssten, wenn es conditional ist,
          // validieren wir 'required' hier nach:
          const isReq = field.validation?.required;
          const val = payloadFields[field.id];
          const isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
          
          if (isReq && isEmpty) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: field.validation?.errorMessageOverrides?.['required'] || 'errors.required',
              path: ['fields', field.id],
              params: { code: 'required' }
            });
          }
        }
      }
    });
  });
}

import { z } from 'zod';
import { WebhookAdapterConfiguration, WEBHOOK_LIMITS } from './types';

export const WebhookEndpointReferenceSchema = z.object({
  key: z.string().min(1)
});

export const OutboundHostPolicySchema = z.object({
  allowedHosts: z.array(z.string().min(1)),
  allowedPorts: z.array(z.number().int().positive()),
  allowSubdomains: z.boolean()
});

export const WebhookAuthenticationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('none') }),
  z.object({
    type: z.literal('bearer'),
    secretReference: z.object({ key: z.string() })
  }),
  z.object({
    type: z.literal('api_key_header'),
    headerName: z.string()
      .min(1)
      .refine(h => !/^(host|content-length|connection|transfer-encoding|cookie|set-cookie)$/i.test(h), "Forbidden header name"),
    secretReference: z.object({ key: z.string() })
  })
]);

export const WebhookSigningConfigurationSchema = z.object({
  algorithm: z.literal('hmac_sha256'),
  secretReference: z.object({ key: z.string() }),
  signatureHeader: z.string().min(1),
  timestampHeader: z.string().min(1),
  includeTimestamp: z.literal(true)
});

export const WebhookResponsePolicySchema = z.object({
  successStatusCodes: z.array(z.number().int().positive()).min(1),
  retryableStatusCodes: z.array(z.number().int().positive())
}).refine(data => {
  const allCodes = [...data.successStatusCodes, ...data.retryableStatusCodes];
  const unique = new Set(allCodes);
  return unique.size === allCodes.length;
}, "Status codes must be unique across success and retryable lists");

export const AdapterExecutionPolicySchema = z.object({
  timeoutMs: z.number().int().positive().max(WEBHOOK_LIMITS.defaultTimeoutMs),
  maximumAttempts: z.literal(1)
});

// Assuming SubmissionFieldMapping and ConsentFieldMapping are defined via Zod elsewhere if needed,
// but for configuration parsing we can define minimal stubs here to ensure basic structural integrity.
const BaseTransformSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('identity') }),
  z.object({ type: z.literal('static_value'), value: z.any() }),
  z.object({ type: z.literal('join'), delimiter: z.string() }),
  z.object({ type: z.literal('lowercase') }),
  z.object({ type: z.literal('uppercase') }),
  z.object({ type: z.literal('boolean_to_string'), trueValue: z.string(), falseValue: z.string() }),
  z.object({ type: z.literal('date_format'), format: z.enum(['iso_date', 'iso_datetime', 'unix_seconds', 'unix_milliseconds']) }),
  z.object({ type: z.literal('country_code'), format: z.enum(['alpha-2', 'alpha-3']) })
]);

const SubmissionFieldMappingSchema = z.object({
  sourceFieldId: z.string().min(1),
  targetField: z.string().min(1).refine(k => !/^(__proto__|prototype|constructor)$/.test(k), "Forbidden target key"),
  required: z.boolean().default(false),
  transform: BaseTransformSchema.optional()
});

const ConsentFieldMappingSchema = z.object({
  consentId: z.string().min(1),
  targetField: z.string().min(1).refine(k => !/^(__proto__|prototype|constructor)$/.test(k), "Forbidden target key"),
  valueMode: z.enum(["accepted_boolean", "accepted_timestamp", "version", "document_reference"])
});

export const WebhookAdapterConfigurationSchema = z.object({
  adapterId: z.literal('webhook'),
  endpointReference: WebhookEndpointReferenceSchema,
  method: z.literal('POST'),
  contentType: z.literal('application/json'),
  fieldMappings: z.array(SubmissionFieldMappingSchema),
  consentMappings: z.array(ConsentFieldMappingSchema),
  authentication: WebhookAuthenticationSchema,
  signing: WebhookSigningConfigurationSchema.optional(),
  responsePolicy: WebhookResponsePolicySchema,
  executionPolicy: AdapterExecutionPolicySchema
}).refine(data => {
  // Check for unique target keys across both mappings
  const targets = [
    ...data.fieldMappings.map(m => m.targetField),
    ...data.consentMappings.map(m => m.targetField)
  ];
  return new Set(targets).size === targets.length;
}, "Target keys must be unique across all mappings");



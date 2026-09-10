import { z } from 'zod';
import { SubmissionFieldMapping, ConsentFieldMapping, AdapterErrorCode } from '../../types';
import { AdapterSecretReference } from '../../ports/Secrets';

// ============================================================================
// Core Limits & Policies
// ============================================================================

export const WEBHOOK_LIMITS = {
  maximumBodyBytes: 100 * 1024, // 100 KB Request Body
  maximumResponseBytes: 10 * 1024, // 10 KB Response Body (we only need headers/status)
  defaultTimeoutMs: 5000, // 5 seconds
} as const;

export type WebhookResponsePolicy = {
  successStatusCodes: readonly number[];
  retryableStatusCodes: readonly number[];
};

export type AdapterExecutionPolicy = {
  timeoutMs: number;
  maximumAttempts: 1; // Strict 1 attempt synchronously
};

// ============================================================================
// Endpoints & Security
// ============================================================================

export type WebhookEndpointReference = {
  key: string;
};

export type ResolvedWebhookEndpoint = {
  url: URL;
  allowedHost: string;
};

export type OutboundHostPolicy = {
  allowedHosts: readonly string[];
  allowedPorts: readonly number[];
  allowSubdomains: boolean;
};

// ============================================================================
// Authentication & Signing
// ============================================================================

export type WebhookAuthentication =
  | { type: "none" }
  | { type: "bearer"; secretReference: AdapterSecretReference }
  | { type: "api_key_header"; headerName: string; secretReference: AdapterSecretReference };

export type WebhookSigningConfiguration = {
  algorithm: "hmac_sha256";
  secretReference: AdapterSecretReference;
  signatureHeader: string;
  timestampHeader: string;
  includeTimestamp: true;
};

export type WebhookSignature = {
  signature: string;
  timestamp: string;
};

export interface WebhookRequestSigner {
  sign(
    input: { body: string; config: WebhookSigningConfiguration }
  ): Promise<WebhookSignature>;
}

// ============================================================================
// Configuration
// ============================================================================

export type WebhookAdapterConfiguration = {
  adapterId: "webhook";
  endpointReference: WebhookEndpointReference;
  method: "POST";
  contentType: "application/json";
  fieldMappings: readonly SubmissionFieldMapping[];
  consentMappings: readonly ConsentFieldMapping[];
  authentication: WebhookAuthentication;
  signing?: WebhookSigningConfiguration; // For future/Phase 6C+ usage
  responsePolicy: WebhookResponsePolicy;
  executionPolicy: AdapterExecutionPolicy;
};

// ============================================================================
// Payload Envelope & Serialization
// ============================================================================

export type WebhookPayloadValue = string | number | boolean | readonly string[] | null;

export type WebhookConsentValueMode =
  | "accepted_boolean"
  | "accepted_timestamp"
  | "version"
  | "document_reference"
  | "purpose";

export type WebhookConsentValue = boolean | string;

export type WebhookPayloadEnvelope = {
  schemaVersion: "1";
  eventType: "form.submission.accepted";
  deliveryId: string;
  occurredAt: string;
  tenant: {
    tenantId: string;
    whiteLabelId?: string;
  };
  form: {
    formId: string;
    formVersion: string;
    translationGroupId: string;
    locale: string;
  };
  submission: {
    publicReference: string;
    submittedAt: string;
    fields: Readonly<Record<string, WebhookPayloadValue>>;
    consents: Readonly<Record<string, WebhookConsentValue>>;
  };
};

export interface CanonicalJsonSerializer {
  serialize(value: WebhookPayloadEnvelope): string;
}

// ============================================================================
// HTTP Client Boundary
// ============================================================================

export type SafeOutboundHttpRequest = {
  url: URL;
  method: "POST";
  headers: Record<string, string>;
  body: string;
  timeoutMs: number;
};

export type SafeOutboundHttpResponse = {
  statusCode: number;
  headers: Record<string, string>;
  bodySnippet?: string; // Only snippet is saved
};

export interface SafeOutboundHttpClient {
  execute(request: SafeOutboundHttpRequest): Promise<SafeOutboundHttpResponse>;
}

// ============================================================================
// Resolvers
// ============================================================================

export type WebhookResolutionContext = {
  tenantId: string;
  whiteLabelId?: string;
};

export interface WebhookEndpointResolver {
  resolve(
    reference: WebhookEndpointReference,
    context: WebhookResolutionContext
  ): Promise<ResolvedWebhookEndpoint>;
}

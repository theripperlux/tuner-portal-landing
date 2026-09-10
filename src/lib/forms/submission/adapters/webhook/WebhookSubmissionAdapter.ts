import { 
  FormSubmissionAdapter, 
  AdapterDeliveryResult,
  FormSubmission,
  ResolvedAdapterConfig,
  DeliveryAttemptContext,
  AdapterErrorCode
} from '../../types';
import { AdapterSecretResolver } from '../../ports/Secrets';
import { 
  WebhookAdapterConfiguration, 
  SafeOutboundHttpClient, 
  WebhookEndpointResolver, 
  CanonicalJsonSerializer
} from './types';
import { WebhookPayloadBuilder } from './WebhookPayloadBuilder';
import { WebhookResponseClassifier } from './WebhookResponseClassifier';

export class WebhookSubmissionAdapter implements FormSubmissionAdapter {
  public readonly id = 'webhook';
  public readonly adapterId = 'webhook';

  constructor(
    private config: WebhookAdapterConfiguration,
    private endpointResolver: WebhookEndpointResolver,
    private secretResolver: AdapterSecretResolver,
    private httpClient: SafeOutboundHttpClient,
    private serializer: CanonicalJsonSerializer
  ) {}

  public async deliver(
    submission: FormSubmission,
    resolvedConfig: ResolvedAdapterConfig,
    context?: DeliveryAttemptContext
  ): Promise<AdapterDeliveryResult> {
    
    const deliveryId = context?.deliveryId || submission.submissionId;
    const attempt = context?.attempt || 1;

    // 1. Build Payload Envelope (Data minimization + mappings)
    const envelope = WebhookPayloadBuilder.build(submission, this.config);
    envelope.deliveryId = deliveryId; // Override with exact delivery attempt ID
    
    // 2. Serialize Canonically
    const serializedBody = this.serializer.serialize(envelope);

    // 3. Resolve Endpoint
    const endpointContext = {
      tenantId: submission.tenantId,
      whiteLabelId: undefined
    };
    
    let endpoint;
    try {
      endpoint = await this.endpointResolver.resolve(this.config.endpointReference, endpointContext);
    } catch (err) {
      return {
        status: "permanent_failure",
        adapterId: this.adapterId,
        errorCode: "invalid_endpoint",
        completedAt: new Date().toISOString()
      };
    }

    // 4. Resolve Secrets & Build Headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-TunerPortal-Delivery-Id': deliveryId,
      'X-TunerPortal-Timestamp': new Date().toISOString(),
      'X-TunerPortal-Attempt': attempt.toString(),
      'X-TunerPortal-Event': envelope.eventType
    };

    try {
      if (this.config.authentication.type === 'bearer') {
        const secret = await this.secretResolver.resolve(this.config.authentication.secretReference);
        if (typeof secret === 'string') {
          headers['Authorization'] = `Bearer ${secret}`;
        }
      } else if (this.config.authentication.type === 'api_key_header') {
        const secret = await this.secretResolver.resolve(this.config.authentication.secretReference);
        if (typeof secret === 'string') {
          headers[this.config.authentication.headerName] = secret;
        }
      }
    } catch (err) {
      return {
        status: "permanent_failure",
        adapterId: this.adapterId,
        errorCode: "secret_resolution_failed",
        completedAt: new Date().toISOString()
      };
    }

    // 5. Execute HTTP Request via Safe Client
    try {
      const response = await this.httpClient.execute({
        url: endpoint.url,
        method: 'POST',
        headers,
        body: serializedBody,
        timeoutMs: this.config.executionPolicy.timeoutMs
      });

      // 6. Classify Response
      const result = WebhookResponseClassifier.classify(
        response.statusCode, 
        this.config.responsePolicy, 
        this.adapterId
      );

      // Optional: Parse Retry-After if retryable
      if (result.status === "retryable_failure" && response.headers['retry-after']) {
        const ra = response.headers['retry-after'];
        const num = parseInt(ra, 10);
        if (!isNaN(num)) {
          // Add backoff seconds if valid
          (result as any).retryAfterSeconds = Math.min(num, 3600); // Cap at 1 hour
        }
      }

      return result;

    } catch (err: any) {
      // Handle Network/SSRF/Timeout errors emitted by SafeOutboundHttpClient
      let errorCode: AdapterErrorCode = "network_error";
      if (err.message?.includes("Timeout")) errorCode = "timeout";
      if (err.message?.includes("SSRF")) errorCode = "blocked_endpoint";
      if (err.message?.includes("exceeded maximum size")) errorCode = "payload_too_large";

      return {
        status: "retryable_failure", // Defaulting client errors to retryable, except maybe SSRF
        adapterId: this.adapterId,
        errorCode,
        completedAt: new Date().toISOString()
      };
    }
  }
}

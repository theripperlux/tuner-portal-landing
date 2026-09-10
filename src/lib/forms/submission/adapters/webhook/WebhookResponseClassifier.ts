import { WebhookResponsePolicy } from './types';
import { AdapterDeliveryResult } from '../../types';

export class WebhookResponseClassifier {
  public static classify(
    statusCode: number,
    policy: WebhookResponsePolicy,
    adapterId: 'webhook' = 'webhook'
  ): AdapterDeliveryResult {
    const nowStr = new Date().toISOString();

    if (policy.successStatusCodes.includes(statusCode)) {
      return {
        status: "delivered",
        adapterId,
        completedAt: nowStr
      };
    }

    if (policy.retryableStatusCodes.includes(statusCode)) {
      // Common retryable codes from HTTP spec (408 Request Timeout, 425 Too Early, 429 Too Many Requests, 5xx Server Errors)
      const errorCode = statusCode === 429 ? "rate_limit" : (statusCode >= 500 ? "vendor_error" : "network_error");
      
      return {
        status: "retryable_failure",
        adapterId,
        errorCode,
        completedAt: nowStr
      };
    }

    // Default Fallbacks if not explicitly listed in policy
    if (statusCode >= 200 && statusCode < 300) {
      return { status: "delivered", adapterId, completedAt: nowStr };
    }

    if (statusCode === 408 || statusCode === 425 || statusCode === 429 || statusCode >= 500) {
      const errorCode = statusCode === 429 ? "rate_limit" : (statusCode >= 500 ? "vendor_error" : "network_error");
      return {
        status: "retryable_failure",
        adapterId,
        errorCode,
        completedAt: nowStr
      };
    }

    // 401 Unauthorized, 403 Forbidden
    if (statusCode === 401) {
      return { status: "permanent_failure", adapterId, errorCode: "unauthorized", completedAt: nowStr };
    }
    if (statusCode === 403) {
      return { status: "permanent_failure", adapterId, errorCode: "forbidden", completedAt: nowStr };
    }

    // 413 Payload Too Large
    if (statusCode === 413) {
      return { status: "permanent_failure", adapterId, errorCode: "payload_too_large", completedAt: nowStr };
    }

    // Everything else (400, 404, etc.)
    return {
      status: "permanent_failure",
      adapterId,
      errorCode: "invalid_response", // Represents generic permanent rejection by endpoint
      completedAt: nowStr
    };
  }
}

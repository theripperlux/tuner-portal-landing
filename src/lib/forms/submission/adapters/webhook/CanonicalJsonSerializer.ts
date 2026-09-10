import { CanonicalJsonSerializer, WebhookPayloadEnvelope } from './types';

export class DefaultCanonicalJsonSerializer implements CanonicalJsonSerializer {
  public serialize(value: WebhookPayloadEnvelope): string {
    // A simple canonical serialization.
    // In a real crypto scenario, you'd use a dedicated canonicalize library like 'fast-json-stable-stringify'.
    // For Phase 6C, we implement a stable key sorting logic.
    return JSON.stringify(this.sortObject(value));
  }

  private sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObject(item)); // Note: Array order is NOT sorted, but items inside are.
    }

    const sortedKeys = Object.keys(obj).sort();
    const result: Record<string, any> = {};
    for (const key of sortedKeys) {
      if (obj[key] !== undefined) {
        result[key] = this.sortObject(obj[key]);
      }
    }
    return result;
  }
}

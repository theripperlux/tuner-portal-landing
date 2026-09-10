import { AdapterDeliveryResult, FormSubmissionAdapter, FormSubmission, ResolvedAdapterConfig, AdapterId, AdapterErrorCode } from './types';

export type InMemoryAdapterBehavior =
  | { type: "success" }
  | { type: "retryable_failure"; errorCode: AdapterErrorCode }
  | { type: "permanent_failure"; errorCode: AdapterErrorCode }
  | { type: "timeout" };

export class InMemorySubmissionAdapter implements FormSubmissionAdapter {
  readonly id: AdapterId = 'in_memory';

  // For testing assertions
  public readonly deliveries: Array<{
    submission: FormSubmission;
    config: ResolvedAdapterConfig;
    result: AdapterDeliveryResult | 'timeout';
  }> = [];

  private behaviorMap = new Map<string, InMemoryAdapterBehavior>();
  private defaultBehavior: InMemoryAdapterBehavior = { type: "success" };

  constructor() {}

  public setBehavior(formId: string, behavior: InMemoryAdapterBehavior) {
    this.behaviorMap.set(formId, behavior);
  }

  public setDefaultBehavior(behavior: InMemoryAdapterBehavior) {
    this.defaultBehavior = behavior;
  }

  async deliver(submission: FormSubmission, config: ResolvedAdapterConfig): Promise<AdapterDeliveryResult> {
    const behavior = this.behaviorMap.get(submission.formId) || this.defaultBehavior;

    if (!config.enabled) {
      const result: AdapterDeliveryResult = { status: 'skipped', adapterId: this.id, reason: 'disabled', completedAt: new Date().toISOString() };
      this.deliveries.push({ submission, config, result });
      return result;
    }

    if (behavior.type === 'timeout') {
      // Wir simulieren ein Timeout, indem wir den Promise lange verzögern.
      // Der Dispatcher sollte Promise.race nutzen, daher wird dieser Code evtl. gar nicht aufgelöst.
      await new Promise(r => setTimeout(r, 10000));
      this.deliveries.push({ submission, config, result: 'timeout' });
      return { status: 'retryable_failure', adapterId: this.id, errorCode: 'timeout', completedAt: new Date().toISOString() };
    }

    if (behavior.type === 'retryable_failure') {
      const result: AdapterDeliveryResult = { status: 'retryable_failure', adapterId: this.id, errorCode: behavior.errorCode, completedAt: new Date().toISOString() };
      this.deliveries.push({ submission, config, result });
      return result;
    }

    if (behavior.type === 'permanent_failure') {
      const result: AdapterDeliveryResult = { status: 'permanent_failure', adapterId: this.id, errorCode: behavior.errorCode, completedAt: new Date().toISOString() };
      this.deliveries.push({ submission, config, result });
      return result;
    }

    const result: AdapterDeliveryResult = {
      status: 'delivered',
      adapterId: this.id,
      externalReference: `inmem_${submission.submissionId}`,
      completedAt: new Date().toISOString()
    };

    this.deliveries.push({ submission, config, result });
    return result;
  }

  public clearDeliveries(): void {
    this.deliveries.length = 0;
  }

  public clearBehaviors(): void {
    this.behaviorMap.clear();
    this.defaultBehavior = { type: "success" };
  }
}

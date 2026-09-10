import { FormSubmissionStatus } from './types';

export class SubmissionStatusMachine {
  private static allowedTransitions: Record<FormSubmissionStatus, readonly FormSubmissionStatus[]> = {
    received: ["validated", "rejected"],
    validated: ["accepted", "rejected"],
    accepted: ["delivery_pending", "delivered", "partially_delivered", "failed"],
    delivery_pending: ["delivered", "partially_delivered", "failed"],
    delivered: [],
    partially_delivered: [],
    failed: [],
    rejected: []
  };

  public static canTransition(current: FormSubmissionStatus, next: FormSubmissionStatus): boolean {
    return this.allowedTransitions[current].includes(next);
  }

  public static assertTransition(current: FormSubmissionStatus, next: FormSubmissionStatus): void {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid status transition from '${current}' to '${next}'.`);
    }
  }

  public static isTerminal(status: FormSubmissionStatus): boolean {
    return this.allowedTransitions[status].length === 0;
  }
}

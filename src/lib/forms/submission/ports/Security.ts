import { SubmissionSecuritySignal } from '../types';

export type SubmissionRejectionReason = 
  | "honeypot" 
  | "rate_limit" 
  | "speed" 
  | "policy_violation";

export type SubmissionSecurityDecision =
  | { accepted: true }
  | {
      accepted: false;
      internalReason: SubmissionRejectionReason;
      publicError: { code: string, messageId: string };
    };

export interface SubmissionSecurityPolicy {
  evaluate(signals: readonly SubmissionSecuritySignal[]): SubmissionSecurityDecision;
}

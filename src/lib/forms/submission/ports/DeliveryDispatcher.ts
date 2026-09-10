import { SubmissionRoutingPolicy } from '../types';

export type SubmissionDeliveryJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "retry_scheduled"
  | "dead_letter";

export type SubmissionDeliveryJob = {
  jobId: string;
  submissionId: string;
  routingPolicyId: string;
  attempt: number;
  createdAt: string;
};

export type DispatchSubmissionCommand = {
  submissionId: string;
  routingPolicy: SubmissionRoutingPolicy;
};

export type SubmissionDeliveryDispatchResult =
  | { status: "dispatched"; jobId?: string }
  | { status: "failed"; error: string };

export interface SubmissionDeliveryDispatcher {
  dispatch(command: DispatchSubmissionCommand): Promise<SubmissionDeliveryDispatchResult>;
}

export type AdapterExecutionPolicy = {
  timeoutMs: number;
  maximumAttempts: number;
};

import { ValidatedFormPayload } from '../../types';

export interface Clock {
  now(): Date;
}

export interface SubmissionIdGenerator {
  generate(): string;
}

export interface SubmissionPayloadHasher {
  hash(payload: ValidatedFormPayload): Promise<string>;
}

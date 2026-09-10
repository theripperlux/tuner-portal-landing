import {
  FormSubmissionService,
  SubmitFormCommand,
  SubmitFormPublicResponse,
  FormSubmission,
  SubmittedFieldValue,
  SubmittedConsent,
  SubmissionRoutingPolicy
} from './types';
import { SubmissionUnitOfWork } from './ports/Persistence';
import { Clock, SubmissionIdGenerator, SubmissionPayloadHasher } from './ports/Utilities';
import { SubmissionSecurityPolicy } from './ports/Security';
import { SubmissionDeliveryDispatcher } from './ports/DeliveryDispatcher';
import { SubmissionStatusMachine } from './SubmissionStatusMachine';

export class DefaultSubmissionService implements FormSubmissionService {
  constructor(
    private uow: SubmissionUnitOfWork,
    private dispatcher: SubmissionDeliveryDispatcher,
    private idGenerator: SubmissionIdGenerator,
    private clock: Clock,
    private hasher: SubmissionPayloadHasher,
    private securityPolicy: SubmissionSecurityPolicy
  ) {}

  async submit(command: SubmitFormCommand): Promise<SubmitFormPublicResponse> {
    const { form, payload, requestContext, idempotencyKey } = command;

    // 1. Security Status prüfen
    const securityDecision = this.securityPolicy.evaluate(requestContext.securitySignals);
    if (!securityDecision.accepted) {
      // Wir persistieren nicht mal, wir verwerfen direkt
      return {
        success: false,
        error: "submission_rejected",
        messageId: securityDecision.publicError.messageId
      };
    }

    // 2. Payload Hash erzeugen
    const payloadHash = await this.hasher.hash(payload);
    const scope = `${requestContext.tenantId}:${form.id}:${idempotencyKey}`;

    try {
      // 3. Unit of Work starten
      return await this.uow.execute(async repos => {
        
        // 4. Idempotency atomar reservieren
        const acquireResult = await repos.idempotency.acquire({
          scope,
          payloadHash,
          submissionId: this.idGenerator.generate(),
          createdAt: this.clock.now().toISOString(),
          expiresAt: new Date(this.clock.now().getTime() + 24 * 60 * 60 * 1000).toISOString()
        });

        if (acquireResult.status === 'conflict') {
          return {
            success: false,
            error: "duplicate_submission",
            messageId: "errors.duplicate_submission"
          };
        }

        if (acquireResult.status === 'existing_same_payload') {
          // Reused!
          await repos.audit.append(acquireResult.record.submissionId, {
            type: 'idempotency_reused',
            occurredAt: this.clock.now().toISOString()
          });

          return {
            success: true,
            status: "accepted",
            submissionReference: acquireResult.record.submissionId
          };
        }

        const submissionId = acquireResult.record.submissionId;
        const submittedAt = this.clock.now().toISOString();

        const fields: SubmittedFieldValue[] = [...payload.fields];
        const consents: SubmittedConsent[] = [...(payload.consents || [])];

        const submission: FormSubmission = {
          submissionId,
          requestId: requestContext.requestId,
          formId: form.id,
          formVersion: (form as any).version || '1.0',
          translationGroupId: (form as any).translationGroupId || 'default',
          tenantId: requestContext.tenantId,
          locale: requestContext.locale,
          submittedAt,
          status: 'accepted', // initial
          fields,
          consents,
          context: {
            campaign: requestContext.campaign,
            userAgent: requestContext.userAgent,
            referrer: requestContext.referrer
          }
        };

        await repos.formSubmissions.create(submission);

        // 6. Audit Events speichern
        await repos.audit.append(submissionId, { type: 'submission_received', occurredAt: submittedAt });
        await repos.audit.append(submissionId, { type: 'submission_accepted', occurredAt: this.clock.now().toISOString() });

        // 7. Dispatcher synchron ausführen
        const routingPolicy: SubmissionRoutingPolicy = (form as any).routingPolicy || {
          type: "single",
          adapterId: "in_memory"
        };

        // Das UoW ist noch aktiv, aber der Dispatcher hat sein eigenes UoW (er ist nicht Teil der Erzeugungs-Transaktion).
        // Um Race-Conditions zu vermeiden, triggern wir den Dispatcher asynchron in setTimeout oder wir lassen ihn nach dem Commit laufen!
        // Da das Execute hier ein offenes Repo hat, warten wir das Commit ab.
        // Dafür returnen wir einfach, und rufen nach dem `execute` den Dispatcher auf.
        return {
          success: true,
          status: "accepted",
          submissionReference: submissionId,
          routingPolicy // temporary hack to pass routing policy outside
        };
      });
    } catch (e) {
      return {
        success: false,
        error: "temporarily_unavailable",
        messageId: "errors.temporarily_unavailable"
      };
    }
  }

  async submitWithDispatch(command: SubmitFormCommand): Promise<SubmitFormPublicResponse> {
    const result = await this.submit(command);

    if (result.success && result.status === 'accepted' && (result as any).routingPolicy) {
      // 8. Dispatcher synchron aufrufen (nach Commit)
      const routingPolicy = (result as any).routingPolicy as SubmissionRoutingPolicy;
      await this.dispatcher.dispatch({
        submissionId: result.submissionReference,
        routingPolicy
      });
      delete (result as any).routingPolicy;
    }

    return result;
  }
}

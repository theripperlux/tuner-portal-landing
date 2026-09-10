import { AdapterExecutionPolicy, DispatchSubmissionCommand, SubmissionDeliveryDispatcher, SubmissionDeliveryDispatchResult } from './ports/DeliveryDispatcher';
import { AdapterRegistry, FormSubmission, AdapterDeliveryResult } from './types';
import { SubmissionUnitOfWork } from './ports/Persistence';

export class SynchronousSubmissionDeliveryDispatcher implements SubmissionDeliveryDispatcher {
  constructor(
    private uow: SubmissionUnitOfWork,
    private registry: AdapterRegistry,
    private policy: AdapterExecutionPolicy,
    private clock: { now(): Date }
  ) {}

  async dispatch(command: DispatchSubmissionCommand): Promise<SubmissionDeliveryDispatchResult> {
    const { submissionId, routingPolicy } = command;

    try {
      // 1. Fetch submission within its own transaction or read-only if supported
      const submission = await this.uow.execute(async repos => {
        return repos.formSubmissions.findById(submissionId);
      });

      if (!submission) {
        return { status: "failed", error: "submission_not_found" };
      }

      // We only execute delivery if status is 'delivery_pending' or 'accepted'
      if (submission.status !== 'accepted' && submission.status !== 'delivery_pending') {
        return { status: "failed", error: `invalid_status_${submission.status}` };
      }

      await this.executeRouting(submission, routingPolicy);

      return { status: "dispatched" };
    } catch (e) {
      // Logger.error(e)
      return { status: "failed", error: "internal_dispatcher_error" };
    }
  }

  private async executeRouting(submission: FormSubmission, routingPolicy: DispatchSubmissionCommand['routingPolicy']): Promise<void> {
    const executeAdapterWithTimeout = async (adapterId: string): Promise<AdapterDeliveryResult> => {
      const adapter = this.registry.getAdapter(adapterId as any);
      if (!adapter) {
        return { status: "permanent_failure", adapterId: adapterId as any, errorCode: "vendor_error", completedAt: this.clock.now().toISOString() };
      }

      try {
        const timeoutPromise = new Promise<AdapterDeliveryResult>(resolve => 
          setTimeout(() => resolve({ 
            status: "retryable_failure", 
            adapterId: adapterId as any, 
            errorCode: "timeout", 
            completedAt: this.clock.now().toISOString() 
          }), this.policy.timeoutMs)
        );

        // Dummy config logic
        const config = { adapterId: adapterId as any, enabled: true, fieldMappingId: "dummy" };

        const deliveryPromise = adapter.deliver(submission, config).then(res => {
          return { ...res, completedAt: this.clock.now().toISOString() };
        });

        return await Promise.race([deliveryPromise, timeoutPromise]);
      } catch (err) {
        return { status: "retryable_failure", adapterId: adapterId as any, errorCode: "network_error", completedAt: this.clock.now().toISOString() };
      }
    };

    let finalStatus: FormSubmission['status'] = 'failed';

    if (routingPolicy.type === 'single') {
      await this.logStart(submission.submissionId, routingPolicy.adapterId);
      const res = await executeAdapterWithTimeout(routingPolicy.adapterId);
      await this.logEnd(submission.submissionId, res);
      finalStatus = res.status === 'delivered' ? 'delivered' : 'failed';
    } else if (routingPolicy.type === 'fan_out') {
      const promises = routingPolicy.adapterIds.map(async id => {
        await this.logStart(submission.submissionId, id);
        const res = await executeAdapterWithTimeout(id);
        await this.logEnd(submission.submissionId, res);
        return res;
      });
      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.status === 'delivered' || r.status === 'skipped');
      const anySuccess = results.some(r => r.status === 'delivered');
      if (allSuccess) finalStatus = 'delivered';
      else if (anySuccess) finalStatus = 'partially_delivered';
      else finalStatus = 'failed';
    } else if (routingPolicy.type === 'primary_with_fallback') {
      await this.logStart(submission.submissionId, routingPolicy.primaryAdapterId);
      const primaryRes = await executeAdapterWithTimeout(routingPolicy.primaryAdapterId);
      await this.logEnd(submission.submissionId, primaryRes);

      if (primaryRes.status === 'delivered') {
        finalStatus = 'delivered';
      } else if (primaryRes.status === 'retryable_failure') {
        // Run fallbacks only on retryable failure
        let fallbackSuccess = false;
        for (const fbId of routingPolicy.fallbackAdapterIds) {
          await this.logStart(submission.submissionId, fbId);
          const fbRes = await executeAdapterWithTimeout(fbId);
          await this.logEnd(submission.submissionId, fbRes);
          if (fbRes.status === 'delivered') {
            fallbackSuccess = true;
            break;
          }
        }
        finalStatus = fallbackSuccess ? 'delivered' : 'failed';
      } else {
        finalStatus = 'failed';
      }
    }

    await this.uow.execute(async repos => {
      await repos.formSubmissions.updateStatus(submission.submissionId, finalStatus);
      await repos.audit.append(submission.submissionId, {
        type: 'submission_status_changed',
        occurredAt: this.clock.now().toISOString(),
        newStatus: finalStatus
      });
    });
  }

  private async logStart(submissionId: string, adapterId: string) {
    await this.uow.execute(async repos => {
      await repos.audit.append(submissionId, {
        type: 'adapter_delivery_started',
        adapterId: adapterId as any,
        occurredAt: this.clock.now().toISOString()
      });
    });
  }

  private async logEnd(submissionId: string, result: AdapterDeliveryResult) {
    await this.uow.execute(async repos => {
      if (result.status === 'delivered') {
        await repos.audit.append(submissionId, {
          type: 'adapter_delivery_completed',
          adapterId: result.adapterId,
          occurredAt: result.completedAt
        });
      } else {
        await repos.audit.append(submissionId, {
          type: 'adapter_delivery_failed',
          adapterId: result.adapterId,
          errorCode: result.status === 'skipped' ? 'vendor_error' : result.errorCode,
          occurredAt: result.completedAt
        });
      }
    });
  }
}

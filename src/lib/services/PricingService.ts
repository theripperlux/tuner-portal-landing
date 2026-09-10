import { TenantScope } from "@/lib/repositories/dashboard.repository.types";

export interface CalculateJobPriceCommand {
  vehicleId: string; // e.g. "car-123"
  selectedServiceIds: string[]; // e.g. ["stage1", "dtc_off"]
}

export interface PricingResult {
  totalCredits: number;
  pricingVersion: string;
}

export class PricingService {
  async calculatePrice(
    scope: TenantScope,
    command: CalculateJobPriceCommand
  ): Promise<PricingResult> {
    // In a real application, we would query the Tenant's active price list.
    // For Phase 2 MVP, we simulate a standard price rule:
    // Base file = 1 credit, +1 for each additional service if configured.
    
    // Simulate validation
    if (command.selectedServiceIds.length === 0) {
      throw new Error("No services selected");
    }

    let total = 0;
    
    for (const service of command.selectedServiceIds) {
      if (service.startsWith("stage")) {
        total += 3; // Stages cost 3
      } else {
        total += 1; // Options cost 1
      }
    }

    return {
      totalCredits: Math.max(1, total),
      pricingVersion: "v1-default"
    };
  }
}

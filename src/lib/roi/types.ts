import { z } from 'zod';

export type ROICalculationMode = "time_and_cost_savings";

export interface ROIInputData {
  ordersPerMonth: number;
  timePerOrderMinutes: number;
  expectedTimeSavingsMinutes: number;
  hourlyLaborCost: number; // in minor units
  tunerPortalMonthlyCost: number; // in minor units
  onboardingCost: number; // in minor units
}

export type ROIWarningCode = 
  | 'user_supplied_estimate'
  | 'excludes_tax'
  | 'capacity_not_revenue';

export interface ROIWarning {
  code: ROIWarningCode;
  messageId: string;
}

export interface ROIOutput {
  id: string;
  value: number | string;
  unit: string;
}

export type ROICalculationResult =
  | {
      status: "calculated";
      outputs: readonly ROIOutput[];
      warnings: readonly ROIWarning[];
    }
  | {
      status: "invalid";
      issues: readonly z.ZodIssue[];
    }
  | {
      status: "not_applicable";
      reasons: readonly string[];
    };

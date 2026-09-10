import { z } from 'zod';
import { ROIInputData } from './types';

export const ROIInputSchema = z.object({
  ordersPerMonth: z.number().int().min(1).max(10000),
  timePerOrderMinutes: z.number().int().min(1).max(1440), // max 24h
  expectedTimeSavingsMinutes: z.number().int().min(1),
  hourlyLaborCost: z.number().int().min(100).max(5000000), // minor units (e.g. 1,00€ to 50.000,00€)
  tunerPortalMonthlyCost: z.number().int().min(0),
  onboardingCost: z.number().int().min(0),
}).refine(data => data.expectedTimeSavingsMinutes <= data.timePerOrderMinutes, {
  message: "Erwartete Zeitersparnis kann nicht größer als die Bearbeitungszeit sein",
  path: ["expectedTimeSavingsMinutes"]
});

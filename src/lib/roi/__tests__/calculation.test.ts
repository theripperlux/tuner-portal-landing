import { describe, it, expect } from 'vitest';
import { calculateROI } from '../calculation';
import { ROIInputData } from '../types';

describe('ROI Calculation Engine', () => {
  it('calculates ROI and break-even correctly for positive scenario', () => {
    const input: ROIInputData = {
      ordersPerMonth: 100,
      timePerOrderMinutes: 30,
      expectedTimeSavingsMinutes: 10,
      hourlyLaborCost: 5000, // 50.00 EUR (minor units)
      tunerPortalMonthlyCost: 20000, // 200.00 EUR
      onboardingCost: 100000 // 1000.00 EUR
    };

    // 100 orders * 10 mins = 1000 mins/month = 16.666... hours/month
    // Yearly hours = 1000 * 12 / 60 = 200 hours
    // Yearly labor cost savings = 200 * 5000 = 1,000,000 minor units (10,000 EUR)
    // Yearly platform cost = 20000 * 12 = 240,000 minor units (2,400 EUR)
    // Net effect = 1,000,000 - 240,000 - 100,000 = 660,000 minor units (6,600 EUR)
    // Total investment = 240,000 + 100,000 = 340,000 (3,400 EUR)
    // ROI % = (660,000 / 340,000) * 100 = 194.117... %
    // Monthly net benefit = (1,000,000 / 12) - 20000 = 83333.33... - 20000 = 63333.33...
    // Break-even months = 100000 / 63333.33... = 1.57... -> ceil -> 2 months

    const result = calculateROI(input);

    expect(result.status).toBe('calculated');
    if (result.status === 'calculated') {
      const outputs = result.outputs;
      const getOutput = (id: string) => outputs.find(o => o.id === id)?.value;

      expect(getOutput('monthlySavedMinutes')).toBe(1000);
      expect(getOutput('yearlySavedHours')).toBe(200);
      expect(getOutput('yearlyLaborCostSavings')).toBe(1000000);
      expect(getOutput('yearlyPlatformCost')).toBe(240000);
      expect(getOutput('yearlyNetEffect')).toBe(660000);
      expect(getOutput('roiPercentage')).toBeCloseTo(194.117, 2);
      expect(getOutput('breakEvenMonths')).toBe(2);

      // Verify warnings
      expect(result.warnings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'user_supplied_estimate' }),
          expect.objectContaining({ code: 'excludes_tax' })
        ])
      );
    }
  });

  it('handles zero investment gracefully (not_applicable)', () => {
    const input: ROIInputData = {
      ordersPerMonth: 100,
      timePerOrderMinutes: 30,
      expectedTimeSavingsMinutes: 10,
      hourlyLaborCost: 5000,
      tunerPortalMonthlyCost: 0,
      onboardingCost: 0
    };

    const result = calculateROI(input);
    expect(result.status).toBe('not_applicable');
  });

  it('handles negative net benefit (no break-even)', () => {
    const input: ROIInputData = {
      ordersPerMonth: 10,
      timePerOrderMinutes: 30,
      expectedTimeSavingsMinutes: 5,
      hourlyLaborCost: 2000, // 20.00 EUR
      tunerPortalMonthlyCost: 50000, // 500.00 EUR (too expensive for this small use case)
      onboardingCost: 100000 // 1000.00 EUR
    };

    // Monthly savings: 10 * 5 = 50 mins = 0.833h = 16.66 EUR
    // Monthly platform: 500.00 EUR
    // Monthly net benefit: 16.66 - 500 = -483.33 -> no break-even

    const result = calculateROI(input);
    expect(result.status).toBe('calculated');
    if (result.status === 'calculated') {
      const outputs = result.outputs;
      const getOutput = (id: string) => outputs.find(o => o.id === id)?.value;

      expect(getOutput('breakEvenMonths')).toBe('no_break_even');
      expect(Number(getOutput('yearlyNetEffect'))).toBeLessThan(0);
      expect(Number(getOutput('roiPercentage'))).toBeLessThan(0);
    }
  });

  it('rejects invalid inputs (Zod issues)', () => {
    const result = calculateROI({
      ordersPerMonth: -5, // Invalid
      timePerOrderMinutes: 30,
      expectedTimeSavingsMinutes: 40, // greater than timePerOrderMinutes
      hourlyLaborCost: 5000,
      tunerPortalMonthlyCost: 20000,
      onboardingCost: 100000
    });

    expect(result.status).toBe('invalid');
    if (result.status === 'invalid') {
      expect(result.issues).toHaveLength(2); // ordersPerMonth and expectedTimeSavingsMinutes
    }
  });
});

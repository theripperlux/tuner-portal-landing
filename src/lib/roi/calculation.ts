import { ROIInputData, ROICalculationResult, ROIOutput, ROIWarning } from './types';
import { ROIInputSchema } from './schema';

export function calculateROI(input: unknown): ROICalculationResult {
  const parsed = ROIInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "invalid",
      issues: parsed.error.issues
    };
  }

  const data = parsed.data as ROIInputData;
  const warnings: ROIWarning[] = [
    { code: "user_supplied_estimate", messageId: "roi.warnings.user_supplied" },
    { code: "excludes_tax", messageId: "roi.warnings.excludes_tax" }
  ];

  // 1. Zeitersparnis
  const monthlySavedMinutes = data.ordersPerMonth * data.expectedTimeSavingsMinutes;
  const monthlySavedHours = monthlySavedMinutes / 60;
  const yearlySavedHours = monthlySavedHours * 12;

  // 2. Kostenersparnis (Wert in Minor Units)
  const yearlyLaborCostSavings = yearlySavedHours * data.hourlyLaborCost;

  // 3. Plattformkosten
  const yearlyPlatformCost = data.tunerPortalMonthlyCost * 12;

  // 4. Nettoeffekt (Wir ziehen Onboardingkosten komplett im ersten Jahr ab)
  const yearlyNetEffect = yearlyLaborCostSavings - yearlyPlatformCost - data.onboardingCost;

  // 5. Investitionskosten
  const totalInvestment = yearlyPlatformCost + data.onboardingCost;

  let roiPercentageOutput: ROIOutput | null = null;
  if (totalInvestment === 0) {
    return {
      status: "not_applicable",
      reasons: ["total_investment_zero"]
    };
  } else {
    const roiPercentage = (yearlyNetEffect / totalInvestment) * 100;
    roiPercentageOutput = {
      id: "roiPercentage",
      value: roiPercentage,
      unit: "%"
    };
  }

  // 6. Break-even
  const monthlyLaborCostSavings = yearlyLaborCostSavings / 12;
  const monthlyNetBenefit = monthlyLaborCostSavings - data.tunerPortalMonthlyCost;

  let breakEvenMonthsOutput: ROIOutput;
  if (monthlyNetBenefit <= 0) {
    breakEvenMonthsOutput = {
      id: "breakEvenMonths",
      value: "no_break_even",
      unit: "months"
    };
  } else {
    // Break-even in Monaten, kaufmännisch auf den nächsten vollen Monat aufgerundet
    const breakEvenMonths = Math.ceil(data.onboardingCost / monthlyNetBenefit);
    breakEvenMonthsOutput = {
      id: "breakEvenMonths",
      value: breakEvenMonths,
      unit: "months"
    };
  }

  const outputs: ROIOutput[] = [
    { id: "monthlySavedMinutes", value: monthlySavedMinutes, unit: "minutes" },
    { id: "yearlySavedHours", value: yearlySavedHours, unit: "hours" },
    { id: "yearlyLaborCostSavings", value: yearlyLaborCostSavings, unit: "minor_currency" },
    { id: "yearlyPlatformCost", value: yearlyPlatformCost, unit: "minor_currency" },
    { id: "yearlyNetEffect", value: yearlyNetEffect, unit: "minor_currency" },
    roiPercentageOutput,
    breakEvenMonthsOutput
  ];

  return {
    status: "calculated",
    outputs,
    warnings
  };
}

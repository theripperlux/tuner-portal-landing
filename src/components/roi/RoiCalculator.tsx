import React from 'react';
import { useRoiCalculator } from './useRoiCalculator';
import { RoiCalculatorForm } from './RoiCalculatorForm';
import { RoiCalculatorResult } from './RoiCalculatorResult';

interface RoiCalculatorProps {
  tunerPortalMonthlyCost: number; // minor units
  onboardingCost: number; // minor units
}

export function RoiCalculator({ tunerPortalMonthlyCost, onboardingCost }: RoiCalculatorProps) {
  const { input, updateInput, result } = useRoiCalculator({
    tunerPortalMonthlyCost,
    onboardingCost
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          TunerPortal ROI Rechner
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
          Berechnen Sie unverbindlich Ihre potenzielle Zeit- und Kostenersparnis durch die Automatisierung mit TunerPortal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <RoiCalculatorForm 
            input={input} 
            updateInput={updateInput} 
            issues={result.status === 'invalid' ? result.issues : undefined}
          />
        </div>
        
        <div>
          <RoiCalculatorResult result={result} />
        </div>
      </div>
    </div>
  );
}

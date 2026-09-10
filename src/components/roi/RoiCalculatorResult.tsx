import React from 'react';
import { ROICalculationResult, ROIOutput } from '@/lib/roi/types';

interface RoiCalculatorResultProps {
  result: ROICalculationResult;
}

export function RoiCalculatorResult({ result }: RoiCalculatorResultProps) {
  if (result.status === 'invalid') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Bitte vervollständigen Sie die Eingaben
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Für eine Berechnung fehlen noch Werte oder einige Eingaben sind ungültig.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result.status === 'not_applicable') {
    return (
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-6">
        <p className="text-sm text-gray-700">
          Die Berechnung ist für diese Konstellation nicht anwendbar (z.B. Kosten = 0).
        </p>
      </div>
    );
  }

  const { outputs, warnings } = result;

  const getOutput = (id: string): ROIOutput | undefined => outputs.find(o => o.id === id);

  const formatCurrency = (minorUnits: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(minorUnits / 100);
  };

  const formatNumber = (val: number, suffix: string = '') => {
    return new Intl.NumberFormat('de-DE').format(val) + suffix;
  };

  const yearlyNetEffect = getOutput('yearlyNetEffect')?.value as number;
  const isNegative = yearlyNetEffect < 0;

  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow overflow-hidden" aria-live="polite">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Ihre geschätzte Ersparnis
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Diese Werte sind Schätzungen basierend auf Ihren Eingaben.
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Jährlich eingesparte Zeit</dt>
            <dd className="mt-1 text-2xl font-semibold text-gray-900">
              {formatNumber(getOutput('yearlySavedHours')?.value as number, ' Std.')}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Arbeitswert der Ersparnis</dt>
            <dd className="mt-1 text-2xl font-semibold text-green-600">
              {formatCurrency(getOutput('yearlyLaborCostSavings')?.value as number)}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Jährliche Plattformkosten</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {formatCurrency(getOutput('yearlyPlatformCost')?.value as number)}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Break-even nach</dt>
            <dd className="mt-1 text-xl font-semibold text-gray-900">
              {getOutput('breakEvenMonths')?.value === 'no_break_even' 
                ? 'Nicht erreicht' 
                : formatNumber(getOutput('breakEvenMonths')?.value as number, ' Monaten')}
            </dd>
          </div>

          <div className="sm:col-span-2 mt-4 pt-4 border-t border-gray-200">
            <dt className="text-base font-medium text-gray-900">Jährlicher Nettoeffekt</dt>
            <dd className={`mt-1 text-3xl font-bold ${isNegative ? 'text-red-600' : 'text-red-800'}`}>
              {formatCurrency(yearlyNetEffect)}
            </dd>
          </div>

        </dl>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
          <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
            {warnings.map(warning => (
              <li key={warning.code}>
                {warning.code === 'user_supplied_estimate' && 'Ergebnisse basieren auf Ihren eigenen Eingaben.'}
                {warning.code === 'excludes_tax' && 'Die Berechnung versteht sich netto zzgl. der gesetzlichen Steuern.'}
                {warning.code === 'capacity_not_revenue' && 'Eingesparte Zeit bedeutet nicht zwingend mehr Umsatz, sofern diese nicht produktiv genutzt werden kann.'}
              </li>
            ))}
            <li>Bei diesen Berechnungen handelt es sich um reine Schätzungen, nicht um garantierte Einsparungen.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ROIInputData } from '@/lib/roi/types';
import { ZodIssue } from 'zod';

interface RoiCalculatorFormProps {
  input: Partial<ROIInputData>;
  updateInput: (key: keyof ROIInputData, value: number) => void;
  issues?: readonly ZodIssue[];
}

export function RoiCalculatorForm({ input, updateInput, issues }: RoiCalculatorFormProps) {
  const getError = (path: string) => {
    return issues?.find(issue => issue.path.includes(path))?.message;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ihre Betriebsdaten</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aufträge pro Monat */}
        <div>
          <label htmlFor="ordersPerMonth" className="block text-sm font-medium text-gray-700">
            Aufträge pro Monat
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="ordersPerMonth"
              min="1"
              max="10000"
              value={input.ordersPerMonth || ''}
              onChange={(e) => updateInput('ordersPerMonth', parseInt(e.target.value, 10))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-800 focus:ring-red-800 sm:text-sm"
              aria-invalid={!!getError('ordersPerMonth')}
              aria-describedby={getError('ordersPerMonth') ? "ordersPerMonth-error" : undefined}
            />
          </div>
          {getError('ordersPerMonth') && (
            <p className="mt-2 text-sm text-red-600" id="ordersPerMonth-error">
              {getError('ordersPerMonth')}
            </p>
          )}
        </div>

        {/* Aktuelle Bearbeitungszeit */}
        <div>
          <label htmlFor="timePerOrderMinutes" className="block text-sm font-medium text-gray-700">
            Bearbeitungszeit pro Auftrag (Minuten)
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="timePerOrderMinutes"
              min="1"
              max="1440"
              value={input.timePerOrderMinutes || ''}
              onChange={(e) => updateInput('timePerOrderMinutes', parseInt(e.target.value, 10))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-800 focus:ring-red-800 sm:text-sm"
              aria-invalid={!!getError('timePerOrderMinutes')}
            />
          </div>
          {getError('timePerOrderMinutes') && (
            <p className="mt-2 text-sm text-red-600">
              {getError('timePerOrderMinutes')}
            </p>
          )}
        </div>

        {/* Erwartete Zeitersparnis */}
        <div>
          <label htmlFor="expectedTimeSavingsMinutes" className="block text-sm font-medium text-gray-700">
            Erwartete Zeitersparnis pro Auftrag (Minuten)
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="expectedTimeSavingsMinutes"
              min="1"
              value={input.expectedTimeSavingsMinutes || ''}
              onChange={(e) => updateInput('expectedTimeSavingsMinutes', parseInt(e.target.value, 10))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-800 focus:ring-red-800 sm:text-sm"
              aria-invalid={!!getError('expectedTimeSavingsMinutes')}
            />
          </div>
          {getError('expectedTimeSavingsMinutes') && (
            <p className="mt-2 text-sm text-red-600">
              {getError('expectedTimeSavingsMinutes')}
            </p>
          )}
        </div>

        {/* Personalkosten */}
        <div>
          <label htmlFor="hourlyLaborCost" className="block text-sm font-medium text-gray-700">
            Personalkosten pro Stunde (Vollkosten)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="hourlyLaborCost"
              min="1"
              // Wir rechnen in der UI mit Major Units (z.B. Euro)
              value={input.hourlyLaborCost ? input.hourlyLaborCost / 100 : ''}
              onChange={(e) => updateInput('hourlyLaborCost', Math.round(parseFloat(e.target.value) * 100))}
              className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-red-800 focus:ring-red-800 sm:text-sm"
              aria-invalid={!!getError('hourlyLaborCost')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€/Std.</span>
            </div>
          </div>
          {getError('hourlyLaborCost') && (
            <p className="mt-2 text-sm text-red-600">
              {getError('hourlyLaborCost')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

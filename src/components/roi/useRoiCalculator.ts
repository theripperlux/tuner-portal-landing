import { useState, useMemo } from 'react';
import { calculateROI } from '@/lib/roi/calculation';
import { ROIInputData, ROICalculationResult } from '@/lib/roi/types';

export function useRoiCalculator(initialInput?: Partial<ROIInputData>) {
  const [input, setInput] = useState<Partial<ROIInputData>>(initialInput || {});
  
  const result = useMemo(() => {
    return calculateROI(input);
  }, [input]);

  const updateInput = (key: keyof ROIInputData, value: number) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  return {
    input,
    updateInput,
    result
  };
}

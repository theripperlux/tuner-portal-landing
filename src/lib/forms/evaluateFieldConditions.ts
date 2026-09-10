import { FieldCondition } from '@/types/modules';

/**
 * Prüft, ob eine Bedingung (Condition) anhand eines Payloads erfüllt ist.
 * Da Payload-Werte Normalisiert sind, können wir einfache Vergleiche anstellen.
 */
export function evaluateCondition(condition: FieldCondition, payload: Record<string, unknown>): boolean {
  const value = payload[condition.dependsOnId];

  switch (condition.operator) {
    case 'is_not_empty':
      return value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
    
    case 'is_empty':
      return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

    case 'equals':
      return String(value) === String(condition.value);

    case 'not_equals':
      return String(value) !== String(condition.value);

    case 'contains':
      if (Array.isArray(value)) {
        return value.includes(condition.value);
      }
      if (typeof value === 'string') {
        return value.includes(String(condition.value));
      }
      return false;

    case 'greater_than':
      if (typeof value === 'number' && typeof condition.value === 'number') {
        return value > condition.value;
      }
      return Number(value) > Number(condition.value);

    case 'less_than':
      if (typeof value === 'number' && typeof condition.value === 'number') {
        return value < condition.value;
      }
      return Number(value) < Number(condition.value);

    default:
      return false;
  }
}

/**
 * Prüft, ob ALLE Bedingungen einer Condition-Liste erfüllt sind.
 * Fallback: Wenn keine Bedingungen definiert sind, gilt das Feld als sichtbar (true).
 */
export function evaluateFieldConditions(conditions: FieldCondition[] | undefined, payload: Record<string, unknown>): boolean {
  if (!conditions || conditions.length === 0) return true;

  // Im aktuellen Modell haben wir implizit ein AND für eine Liste von Conditions auf einem Feld.
  return conditions.every(c => evaluateCondition(c, payload));
}

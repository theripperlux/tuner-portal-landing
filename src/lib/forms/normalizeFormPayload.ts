import { NormalizedFormValue } from './types';

/**
 * Normalisiert rohe Eingabedaten basierend auf grundlegenden Heuristiken oder expliziten Regeln.
 * Dies passiert BEVOR die strenge Validierung greift, damit die Zod-Schemas von bereinigten Daten ausgehen können.
 */
export function normalizeValue(value: unknown): NormalizedFormValue {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return null;
    }
    return value;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    // Leere Arrays werden zu undefined (bzw. null), falls sie optional sein sollen,
    // aber wir behalten sie oft als [] damit required-Checks (min(1)) zuschlagen können.
    const normalizedArray = value
      .map(v => (typeof v === 'string' ? v.trim() : v))
      .filter(v => v !== null && v !== undefined && v !== '');
      
    // Deduplication (Set) falls es ein einfaches String-Array ist (für Multiselect)
    if (normalizedArray.every(v => typeof v === 'string' || typeof v === 'number')) {
      return Array.from(new Set(normalizedArray)) as string[];
    }
    return normalizedArray as readonly string[];
  }

  return null;
}

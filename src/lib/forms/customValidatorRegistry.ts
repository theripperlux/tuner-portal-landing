import { z } from 'zod';

export type CustomValidatorId = 'business_email' | 'vat_structure' | 'phone_structure';

type CustomValidatorFunction = (value: unknown) => boolean;

/**
 * Registrierte Custom Validators. 
 * Müssen synchron sein, da das Zod-Schema für die erste Payload-Prüfung synchron arbeitet.
 */
export const customValidators: Record<CustomValidatorId, CustomValidatorFunction> = {
  business_email: (value: unknown) => {
    if (typeof value !== 'string') return false;
    // Einfache Liste an Freemailern ablehnen (nur als Beispiel)
    const freeMailers = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'gmx.de', 'web.de'];
    const domain = value.split('@')[1];
    if (!domain) return false;
    return !freeMailers.includes(domain.toLowerCase());
  },
  vat_structure: (value: unknown) => {
    if (typeof value !== 'string') return false;
    // Einfache Regex für EU-VAT IDs (rudimentär)
    return /^[A-Z]{2}[0-9A-Z]{2,12}$/.test(value.replace(/[^A-Z0-9]/gi, '').toUpperCase());
  },
  phone_structure: (value: unknown) => {
    if (typeof value !== 'string') return false;
    // Erlaubt +, Zahlen, Leerzeichen, Bindestriche und Klammern
    return /^[+0-9\s-()]{6,20}$/.test(value);
  }
};

import { SubmissionFieldMapping, SubmittedFieldValue } from './types';

export class FieldMapper {
  /**
   * Wandelt die submitted fields anhand der definierten Regeln in ein Ziel-Objekt um.
   */
  public static mapFields(fields: readonly SubmittedFieldValue[], rules: readonly SubmissionFieldMapping[]): Record<string, any> {
    const targetPayload: Record<string, any> = {};

    for (const rule of rules) {
      if (rule.transform?.type === 'static_value') {
        if (targetPayload[rule.targetField] !== undefined) throw new Error(`Duplicate target mapping detected for '${rule.targetField}'.`);
        targetPayload[rule.targetField] = rule.transform.value;
        continue;
      }

      const field = fields.find(f => f.fieldId === rule.sourceFieldId);
      
      if (rule.required && (field === undefined || field.value === undefined || field.value === null)) {
        throw new Error(`Required field mapping failed: Source field '${rule.sourceFieldId}' is missing or empty.`);
      }

      if (!field || field.value === undefined || field.value === null) {
        continue;
      }

      const transformedValue = this.applyTransform(field.value, rule);
      
      // Target Field auflösen (unterstützt einfaches Nested Mapping wie "address.city", falls gewünscht - hier flat)
      if (targetPayload[rule.targetField] !== undefined) {
        // Falls schon belegt, könnte man loggen. Laut Architektur-Vorgabe: keine doppelten Target-Zuweisungen
        throw new Error(`Duplicate target mapping detected for '${rule.targetField}'.`);
      }
      
      targetPayload[rule.targetField] = transformedValue;
    }

    return targetPayload;
  }

  private static applyTransform(value: any, rule: SubmissionFieldMapping): any {
    if (!rule.transform) return value;

    switch (rule.transform.type) {
      case 'identity':
        return value;
      
      case 'join':
        if (Array.isArray(value)) {
          return value.join(rule.transform.delimiter);
        }
        return value;
      
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      
      case 'boolean_to_string':
        if (typeof value === 'boolean') {
          return value ? rule.transform.trueValue : rule.transform.falseValue;
        }
        return value;
      
      case 'date_format':
        if (value instanceof Date || typeof value === 'string') {
          const d = value instanceof Date ? value : new Date(value);
          if (!isNaN(d.getTime())) {
            if (rule.transform.format === 'iso_date') return d.toISOString().split('T')[0];
            if (rule.transform.format === 'iso_datetime') return d.toISOString();
            if (rule.transform.format === 'unix_seconds') return Math.floor(d.getTime() / 1000);
            if (rule.transform.format === 'unix_milliseconds') return d.getTime();
          }
        }
        return value;
      
      case 'country_code':
        // Minimalistischer Stub. In der echten App könnte hier alpha-2 nach alpha-3 umgewandelt werden
        return typeof value === 'string' ? value.toUpperCase().substring(0, rule.transform.format === 'alpha-3' ? 3 : 2) : value;

      case 'static_value':
        return rule.transform.value;

      default:
        // @ts-ignore - Falls neue Transforms hinzukommen
        throw new Error(`Unknown transform type: ${rule.transform.type}`);
    }
  }
}

import { describe, it, expect } from 'vitest';
import { FieldMapper } from '../FieldMapper';
import { SubmissionFieldMapping, SubmittedFieldValue } from '../types';

describe('FieldMapper', () => {
  const fields: readonly SubmittedFieldValue[] = [
    { fieldId: 'f1', value: 'John', fieldType: 'text' },
    { fieldId: 'f2', value: 'Doe', fieldType: 'text' },
    { fieldId: 'f3', value: true, fieldType: 'checkbox' },
    { fieldId: 'f4', value: ['A', 'B'], fieldType: 'multiselect' },
    { fieldId: 'f5', value: '2023-01-01T12:00:00Z', fieldType: 'datetime' }
  ];

  it('maps identity and static values correctly', () => {
    const rules: readonly SubmissionFieldMapping[] = [
      { sourceFieldId: 'f1', targetField: 'firstname', required: true, transform: { type: 'identity' } },
      { sourceFieldId: 'f2', targetField: 'lastname', required: false },
      { sourceFieldId: 'missing', targetField: 'static', required: false, transform: { type: 'static_value', value: 'hardcoded' } }
    ];

    const result = FieldMapper.mapFields(fields, rules);
    expect(result.firstname).toBe('John');
    expect(result.lastname).toBe('Doe'); // implicit identity
    expect(result.static).toBe('hardcoded');
  });

  it('throws on missing required fields', () => {
    const rules: readonly SubmissionFieldMapping[] = [
      { sourceFieldId: 'missing', targetField: 'test', required: true }
    ];
    expect(() => FieldMapper.mapFields(fields, rules)).toThrowError(/missing or empty/);
  });

  it('applies lowercase and uppercase', () => {
    const rules: readonly SubmissionFieldMapping[] = [
      { sourceFieldId: 'f1', targetField: 'lower', required: false, transform: { type: 'lowercase' } },
      { sourceFieldId: 'f2', targetField: 'upper', required: false, transform: { type: 'uppercase' } }
    ];
    const result = FieldMapper.mapFields(fields, rules);
    expect(result.lower).toBe('john');
    expect(result.upper).toBe('DOE');
  });

  it('applies join to arrays', () => {
    const rules: readonly SubmissionFieldMapping[] = [
      { sourceFieldId: 'f4', targetField: 'joined', required: false, transform: { type: 'join', delimiter: ';' } }
    ];
    const result = FieldMapper.mapFields(fields, rules);
    expect(result.joined).toBe('A;B');
  });

  it('applies dates correctly', () => {
    const rules: readonly SubmissionFieldMapping[] = [
      { sourceFieldId: 'f5', targetField: 'iso', required: false, transform: { type: 'date_format', format: 'iso_datetime' } },
      { sourceFieldId: 'f5', targetField: 'unix', required: false, transform: { type: 'date_format', format: 'unix_seconds' } }
    ];
    const result = FieldMapper.mapFields(fields, rules);
    expect(result.iso).toBe('2023-01-01T12:00:00.000Z');
    expect(result.unix).toBe(1672574400);
  });
});

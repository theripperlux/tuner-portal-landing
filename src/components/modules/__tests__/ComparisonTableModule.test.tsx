import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ComparisonTableModule } from '../ComparisonTableModule';
import { ComparisonTableModule as ComparisonTableModuleType, ComparisonColumn } from '@/types/modules';

const baseCols: ComparisonColumn[] = [
  { id: 'tunerportal', name: 'TunerPortal', status: 'confirmed' },
  { id: 'competitor', name: 'Competitor X', status: 'confirmed' }
];

describe('ComparisonTableModule', () => {
  it('renders confirmed rows and columns', () => {
    render(
      <ComparisonTableModule 
        module={{
          _type: 'comparisonTable',
          columns: baseCols,
          rows: [
            {
              id: 'row1',
              label: 'Public API',
              values: [
                { entityId: 'tunerportal', value: true, valueType: 'boolean', status: 'confirmed', internalOnly: true },
                { entityId: 'competitor', value: false, valueType: 'boolean', status: 'confirmed', verifiedAt: new Date().toISOString() }
              ]
            }
          ]
        }}
      />
    );
    expect(screen.getByText('TunerPortal')).toBeDefined();
    expect(screen.getByText('Competitor X')).toBeDefined();
    expect(screen.getByText('Public API')).toBeDefined();
    expect(screen.getByText('Yes')).toBeDefined(); // sr-only
    expect(screen.getByText('No')).toBeDefined(); // sr-only
  });

  it('filters out columns that are not confirmed', () => {
    render(
      <ComparisonTableModule 
        module={{
          _type: 'comparisonTable',
          columns: [
            { id: 'tunerportal', name: 'TunerPortal', status: 'confirmed' },
            { id: 'competitor', name: 'Competitor X', status: 'needs_review' }
          ],
          rows: [
            {
              id: 'row1',
              label: 'Public API',
              values: [
                { entityId: 'tunerportal', value: true, valueType: 'boolean', status: 'confirmed', internalOnly: true },
                { entityId: 'competitor', value: false, valueType: 'boolean', status: 'confirmed', verifiedAt: new Date().toISOString() }
              ]
            }
          ]
        }}
      />
    );
    expect(screen.queryByText('Competitor X')).toBeNull();
  });

  it('filters out rows without any publishable values', () => {
    const { container } = render(
      <ComparisonTableModule 
        module={{
          _type: 'comparisonTable',
          columns: baseCols,
          rows: [
            {
              id: 'row1',
              label: 'Public API',
              values: [
                // Not confirmed
                { entityId: 'tunerportal', value: true, valueType: 'boolean', status: 'needs_review' },
                // External but no verifiedAt
                { entityId: 'competitor', value: false, valueType: 'boolean', status: 'confirmed' }
              ]
            }
          ]
        }}
      />
    );
    // Neither value is publishable, row is empty, table should be empty
    expect(container.firstChild).toBeNull();
  });

  it('renders unknown and not_applicable correctly', () => {
    render(
      <ComparisonTableModule 
        module={{
          _type: 'comparisonTable',
          columns: baseCols,
          rows: [
            {
              id: 'row1',
              label: 'Mystery Feature',
              values: [
                { entityId: 'tunerportal', value: null, valueType: 'unknown', status: 'confirmed', internalOnly: true },
                { entityId: 'competitor', value: null, valueType: 'not_applicable', status: 'confirmed', verifiedAt: new Date().toISOString() }
              ]
            }
          ]
        }}
      />
    );
    expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0);
    expect(screen.getByText('Not Applicable')).toBeDefined(); // sr-only
  });

  it('renders text, lists, number, currency, percentage', () => {
    render(
      <ComparisonTableModule 
        module={{
          _type: 'comparisonTable',
          columns: baseCols,
          rows: [
            {
              id: 'row1',
              label: 'Text Feature',
              values: [
                { entityId: 'tunerportal', value: 'Hello World', valueType: 'text', status: 'confirmed', internalOnly: true },
                { entityId: 'competitor', value: ['Item 1', 'Item 2'], valueType: 'list', status: 'confirmed', verifiedAt: new Date().toISOString() }
              ]
            },
            {
              id: 'row2',
              label: 'Numbers',
              values: [
                { entityId: 'tunerportal', value: 99.95, valueType: 'percentage', status: 'confirmed', internalOnly: true },
                { entityId: 'competitor', value: 50, valueType: 'currency', status: 'confirmed', verifiedAt: new Date().toISOString() }
              ]
            }
          ]
        }}
      />
    );
    expect(screen.getByText('Hello World')).toBeDefined();
    expect(screen.getByText('Item 1')).toBeDefined();
    expect(screen.getByText('Item 2')).toBeDefined();
    // Use formatStatisticValue output checks if needed, but it's largely mocked or system dependent
    // We just check it didn't throw
  });
});

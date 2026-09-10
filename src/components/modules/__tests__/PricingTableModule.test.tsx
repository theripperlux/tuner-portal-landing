import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PricingTableModuleComponent from '../PricingTableModule';
import { PricingTableModule } from '@/types/modules';

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

describe('PricingTableModuleComponent', () => {
  const getMockModule = (): PricingTableModule => ({
    _type: 'pricingTable',
    heading: 'Pricing',
    plans: [
      {
        id: 'p1',
        name: 'Basic',
        amount: {
          pricingType: 'fixed',
          billingPeriod: 'month',
          prices: [{ currency: 'EUR', minorAmount: 2900 }]
        },
        status: 'confirmed',
        features: [
          { id: 'f1', label: 'Core feature', included: true, status: 'confirmed' }
        ],
        ctas: [
          { id: 'c1', label: 'Buy Now', href: '#', status: 'confirmed' }
        ]
      },
      {
        id: 'p2',
        name: 'Pro',
        amount: {
          pricingType: 'fixed',
          billingPeriod: 'month',
          prices: [{ currency: 'EUR', minorAmount: 9900 }]
        },
        status: 'needs_review', // should be filtered out entirely
        features: [
          { id: 'f2', label: 'Pro feature', included: true, status: 'confirmed' }
        ],
        ctas: [
          { id: 'c2', label: 'Buy Pro', href: '#', status: 'confirmed' }
        ]
      }
    ]
  });

  it('renders only publishable plans', () => {
    const module = getMockModule();
    render(<PricingTableModuleComponent module={module} />);
    
    expect(screen.getByText('Basic')).toBeDefined();
    expect(screen.queryByText('Pro')).toBeNull();
  });

  it('formats minor units to currency correctly', () => {
    const module = getMockModule();
    render(<PricingTableModuleComponent module={module} />);
    
    // 2900 minor units EUR in en locale -> €29.00
    const priceText = screen.getByText(/29/);
    expect(priceText).toBeDefined();
  });

  it('drops the entire module if no publishable plans exist', () => {
    const module = getMockModule();
    module.plans[0].status = 'hidden';
    
    const { container } = render(<PricingTableModuleComponent module={module} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders footnotes properly', () => {
    const module = getMockModule();
    module.footnotes = [{ id: 'fn1', scope: 'referenced', symbol: '*', text: 'Conditions apply' }];
    module.plans[0].features[0].footnoteRefs = ['fn1'];

    render(<PricingTableModuleComponent module={module} />);
    
    // Check footnote link
    expect(screen.getByRole('link', { name: 'Footnote *' })).toBeDefined();
    // Check footnote text in footer
    expect(screen.getByText('Conditions apply')).toBeDefined();
  });

  it('filters out unpublishable sub-elements', () => {
    const module = getMockModule();
    module.plans[0].features.push({
      id: 'f_hidden',
      label: 'Secret feature',
      included: true,
      status: 'hidden'
    });
    
    render(<PricingTableModuleComponent module={module} />);
    expect(screen.queryByText('Secret feature')).toBeNull();
  });
});

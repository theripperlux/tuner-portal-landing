import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeatureGridModule } from '../FeatureGridModule';

describe('FeatureGridModule', () => {
  it('renders heading and description and confirmed items', () => {
    render(
      <FeatureGridModule 
        module={{
          _type: 'featureGrid',
          heading: 'Test Heading',
          description: 'Test Description',
          items: [
            { id: '1', status: 'confirmed', title: 'Item 1', description: 'Desc 1' }
          ]
        }} 
      />
    );
    expect(screen.getByRole('heading', { level: 2, name: /test heading/i })).toBeDefined();
    expect(screen.getByText(/test description/i)).toBeDefined();
  });

  it('renders multiple items correctly', () => {
    render(
      <FeatureGridModule 
        module={{
          _type: 'featureGrid',
          items: [
            { id: 'a', status: 'confirmed', title: 'Item A', description: 'Desc A' },
            { id: 'b', status: 'confirmed', title: 'Item B', description: 'Desc B' }
          ]
        }} 
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: /item a/i })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: /item b/i })).toBeDefined();
  });

  it('does not render if items are empty or unconfirmed', () => {
    const { container } = render(
      <FeatureGridModule 
        module={{
          _type: 'featureGrid',
          heading: 'Hidden Heading',
          items: [
            { id: 'x', status: 'needs_review', title: 'Hidden', description: 'Desc' }
          ]
        }} 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders links if provided', () => {
    render(
      <FeatureGridModule 
        module={{
          _type: 'featureGrid',
          items: [
            { 
              id: 'l1',
              status: 'confirmed',
              title: 'Item Link', 
              description: 'Desc',
              link: { type: 'internal', href: '/test-link', label: 'Learn More' }
            }
          ]
        }} 
      />
    );
    const link = screen.getByRole('link', { name: /learn more/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/test-link');
  });

  it('renders CTA button if provided', () => {
    render(
      <FeatureGridModule 
        module={{
          _type: 'featureGrid',
          items: [
            { 
              id: 'c1',
              status: 'confirmed',
              title: 'Item CTA', 
              description: 'Desc',
              cta: { type: 'external', href: 'https://test-cta.com', label: 'Sign Up' }
            }
          ]
        }} 
      />
    );
    const cta = screen.getByRole('link', { name: /sign up/i });
    expect(cta).toBeDefined();
    expect(cta.getAttribute('href')).toBe('https://test-cta.com');
    expect(cta.getAttribute('target')).toBe('_blank');
  });
});

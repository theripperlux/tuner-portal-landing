import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestimonialsModule } from '../TestimonialsModule';
import { TestimonialItem } from '@/types/modules';

const baseItem: Omit<TestimonialItem, 'id' | 'status'> = {
  quote: 'This is an amazing product!',
  locale: 'en',
  consentConfirmed: true,
  verifiedAt: new Date().toISOString(),
  quoteSource: 'Email',
};

describe('TestimonialsModule', () => {
  it('renders confirmed + consentConfirmed item with name', () => {
    render(
      <TestimonialsModule 
        module={{
          _type: 'testimonials',
          items: [
            { id: '1', status: 'confirmed', name: 'John Doe', ...baseItem }
          ]
        }}
      />
    );
    expect(screen.getByText(/this is an amazing product!/i)).toBeDefined();
    expect(screen.getByText('John Doe')).toBeDefined();
  });

  it('filters out items based on strict requirements', () => {
    const { container } = render(
      <TestimonialsModule 
        module={{
          _type: 'testimonials',
          items: [
            // No name and not anonymized
            { id: '2', status: 'confirmed', ...baseItem },
            // Not confirmed
            { id: '3', status: 'needs_review', name: 'Jane', ...baseItem },
            // Consent not confirmed
            { id: '4', status: 'confirmed', name: 'Bob', ...baseItem, consentConfirmed: false },
            // Withdrawn consent
            { id: '5', status: 'confirmed', name: 'Alice', ...baseItem, withdrawalAt: '2020-01-01T00:00:00Z' },
            // No quote source
            { id: '6', status: 'confirmed', name: 'Eve', ...baseItem, quoteSource: undefined, sourceReference: undefined },
            // Translated but not reviewed
            { id: '7', status: 'confirmed', name: 'Tom', ...baseItem, translated: true, translationReviewed: false },
          ]
        }}
      />
    );
    // None should be publishable, so container should be empty (null rendered)
    expect(container.firstChild).toBeNull();
  });

  it('renders anonymized testmonials with displayName', () => {
    render(
      <TestimonialsModule 
        module={{
          _type: 'testimonials',
          items: [
            { id: '8', status: 'confirmed', anonymized: true, displayName: 'CEO of Tuning Corp', ...baseItem }
          ]
        }}
      />
    );
    expect(screen.getByText('CEO of Tuning Corp')).toBeDefined();
  });

  it('shows verification badge if verifiedAt is present', () => {
    render(
      <TestimonialsModule 
        module={{
          _type: 'testimonials',
          items: [
            { id: '9', status: 'confirmed', name: 'Verified Guy', ...baseItem, verifiedAt: new Date().toISOString() }
          ]
        }}
      />
    );
    expect(screen.getByText('Verified')).toBeDefined(); // sr-only text
  });

  it('shows translation note if translated is true', () => {
    render(
      <TestimonialsModule 
        module={{
          _type: 'testimonials',
          items: [
            { id: '10', status: 'confirmed', name: 'Translated Guy', ...baseItem, translated: true, translationReviewed: true }
          ]
        }}
      />
    );
    expect(screen.getByText(/translated from original/i)).toBeDefined();
  });
});

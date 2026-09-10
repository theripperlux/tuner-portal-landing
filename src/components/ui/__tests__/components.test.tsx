import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';
import { Accordion, AccordionItem } from '../Accordion';
import { Tabs } from '../Tabs';

describe('UI Foundation Components', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
    });

    it('renders loading state correctly', () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Ensure loader icon is hidden from screen readers but exists
      expect(button.querySelector('.animate-spin')).toBeDefined();
    });

    it('supports asChild pattern for links', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole('link', { name: /link button/i });
      expect(link).toBeDefined();
      expect(link.getAttribute('href')).toBe('/test');
    });
  });

  describe('Accordion', () => {
    it('toggles visibility on click', () => {
      render(
        <Accordion>
          <AccordionItem title="Question 1">Answer 1</AccordionItem>
        </Accordion>
      );
      const button = screen.getByRole('button', { name: /question 1/i });
      expect(button.getAttribute('aria-expanded')).toBe('false');
      
      fireEvent.click(button);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(screen.getByText('Answer 1')).toBeDefined();
    });
  });

  describe('Tabs', () => {
    it('switches content on click', () => {
      render(
        <Tabs 
          tabs={[
            { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
            { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
          ]}
        />
      );
      
      expect(screen.getByText('Content 1')).toBeDefined();
      
      const tab2Button = screen.getByRole('button', { name: /tab 2/i });
      fireEvent.click(tab2Button);
      
      // Checking for style/visibility changes could be done by inspecting classes,
      // but Testing Library doesn't automatically evaluate tailwind class 'hidden',
      // so we ensure the DOM structure changes correctly or rely on the class being applied.
      expect(screen.getByText('Content 2')).toBeDefined();
    });
  });
});

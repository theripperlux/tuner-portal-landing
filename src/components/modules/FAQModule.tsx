import React from 'react';
import { FAQModule as FAQModuleType } from '@/types/modules';
import { Accordion, AccordionItem } from '../ui/Accordion';

interface Props {
  module: FAQModuleType;
}

export function FAQModule({ module }: Props) {
  if (!module.questions || module.questions.length === 0) return null;
  return (
    <section className="py-24 bg-background border-t border-secondary w-full mt-16">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-bold font-['Outfit'] mb-12 text-center text-foreground">
          {module.title || 'Frequently Asked Questions'}
        </h2>
        <Accordion>
          {module.questions.map((q, i) => (
            <AccordionItem key={i} title={q.question}>
              {q.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

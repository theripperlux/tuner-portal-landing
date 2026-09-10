import React from 'react';
import { RichTextModule as RichTextModuleType } from '@/types/modules';

interface Props {
  module: RichTextModuleType;
}

export function RichTextModule({ module }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none mb-16 mx-auto px-6 lg:px-12 w-full">
      <div dangerouslySetInnerHTML={{ __html: module.content }} />
    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import { ScreenshotsModule as ScreenshotsModuleType } from '@/types/modules';
import { Card } from '../ui/Card';

interface Props {
  module: ScreenshotsModuleType;
}

export function ScreenshotsModule({ module }: Props) {
  if (!module.images || module.images.length === 0) return null;
  return (
    <div className="my-16 max-w-[1200px] mx-auto px-6 lg:px-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {module.images.map((img: any, i: number) => (
          <Card key={i} className="overflow-hidden p-0 border-secondary">
            <Image 
              src={img.url} 
              alt={img.alt || 'Screenshot'} 
              width={800} 
              height={600}
              className="w-full h-auto object-cover"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

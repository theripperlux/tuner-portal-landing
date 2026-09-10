import React from 'react';
import SetupGuide from '@/components/setup-guide/SetupGuide';
import { SiteNav } from '@/components/SiteNav';
import LiveChat from '@/components/LiveChat';

export const metadata = {
  title: 'Setup Guide | TunerPortal',
  description: 'Interactive Setup Guide for TunerPortal Admin Panel',
};

export default function SetupGuidePage() {
  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen text-black dark:text-white transition-colors">
      <SiteNav />
      <div className="pt-24 pb-20">
        <SetupGuide />
      </div>
      <LiveChat />
    </div>
  );
}

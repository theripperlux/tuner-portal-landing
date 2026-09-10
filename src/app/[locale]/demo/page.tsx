import { useTranslations } from 'next-intl';
import { SiteNav } from '@/components/SiteNav';
import { PlayCircle, Video } from 'lucide-react';
import { Metadata } from 'next';
import { DemoVideoGrid } from '@/components/DemoVideoGrid';

export const metadata: Metadata = {
  title: 'Platform Demos | TunerPortal',
  description: 'See the AI Business Platform in action. Watch our detailed feature walkthroughs and tutorials.'
};

export default function DemoHub() {
  const t = useTranslations();
  
  const videos = [
    { id: 1, title: 'Platform Overview', duration: '3:45', img: '/screenshots/admin_platform_light.png', desc: 'A complete tour of the TunerPortal ecosystem.', videoUrl: '/videos/Platform Overview.mp4' },
    { id: 2, title: 'Customer Portal', duration: '2:15', img: '/screenshots/Customerdashbord_light.png', desc: 'See how your clients upload and receive tuned files.', videoUrl: '/videos/Customer Portal.mp4' },
    { id: 3, title: 'Autodata', duration: '4:20', img: '/screenshots/admin_platform_Dark.png', desc: 'Manage users, pricing, and files like a pro.', videoUrl: '/videos/Autodata.mp4' },
    { id: 4, title: 'AI Builder', duration: '5:10', img: '/screenshots/automatedecudetection_dark.png', desc: 'Build your own automated tuning agents.', videoUrl: '/videos/AI Builder.mp4' },
    { id: 5, title: 'Integrations', duration: '6:00', img: '/screenshots/autodata_dark.png', desc: 'Connect AutoTuner, Flex, and Kess3 seamlessly.', videoUrl: '/videos/Integrations.mp4' },
    { id: 6, title: 'White Label', duration: '1:50', img: '/screenshots/withelabel_dark.png', desc: 'Customize colors, logos, and domains instantly.', videoUrl: '/videos/White Label.mp4' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors">
      <SiteNav />

      {/* HEADER */}
      <div className="pt-32 pb-16 border-b border-black/5 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/5 text-black dark:text-white px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 mb-6">
            <Video className="w-4 h-4" /> Video Hub
          </span>
          <h1 className="font-['Archivo'] font-black text-4xl md:text-6xl uppercase tracking-tighter text-black dark:text-white mb-6">
            See the Platform <span className="text-red-500 dark:text-red-400">in Action</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover why the world's leading tuning networks rely on TunerPortal to automate, scale, and manage their business.
          </p>
        </div>
      </div>

      <DemoVideoGrid videos={videos} />

    </div>
  );
}

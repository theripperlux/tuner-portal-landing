"use client";

import { useState } from 'react';
import { PlayCircle, X } from 'lucide-react';

type VideoItem = {
  id: number;
  title: string;
  duration: string;
  img: string;
  desc: string;
  videoUrl: string;
};

export function DemoVideoGrid({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <>
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map(v => (
            <div key={v.id} className="group cursor-pointer" onClick={() => setActiveVideo(v)}>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 dark:bg-[#111] mb-4 border border-black/5 dark:border-white/[0.05] shadow-lg">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform transition-transform shadow-2xl">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                {/* Fallback pattern if image is missing */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <img src={v.img} alt={v.title} className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded-md z-20 font-bold border border-white/10">
                  {v.duration}
                </div>
              </div>
              <h3 className="text-xl font-bold font-['Archivo'] text-black dark:text-white mb-1 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                {v.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setActiveVideo(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200 relative">
            <video 
              src={activeVideo.videoUrl} 
              autoPlay 
              controls 
              className="w-full h-full object-contain"
              playsInline
            />
          </div>
        </div>
      )}
    </>
  );
}

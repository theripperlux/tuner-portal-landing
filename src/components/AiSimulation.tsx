'use client';
import { useState, useEffect } from 'react';
import { UploadCloud, File, RefreshCw, CheckCircle, ChevronRight } from 'lucide-react';

export default function AiSimulation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (step === 0) {
      // Waiting state -> triggers upload
      timeout = setTimeout(() => setStep(1), 2000);
    } else if (step === 1) {
      // Uploaded -> AI Processing (2 seconds)
      timeout = setTimeout(() => setStep(2), 2500);
    } else if (step === 2) {
      // Finished -> Reset after a while
      timeout = setTimeout(() => setStep(0), 4000);
    }

    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="bg-[#161821] border border-white/5 rounded-lg p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Glow Effects */}
        {step === 1 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ff2d3f]/10 rounded-full blur-[80px] pointer-events-none transition-all duration-500" />}
        {step === 2 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#4ade80]/10 rounded-full blur-[80px] pointer-events-none transition-all duration-500" />}

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Step 1: Input */}
          <div className={`flex flex-col items-center transition-all duration-500 ${step >= 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 border-dashed ${step === 0 ? 'border-[#e8192c] bg-[#e8192c]/5' : 'border-white/20 bg-white/5'}`}>
              <UploadCloud className={`w-8 h-8 ${step === 0 ? 'text-[#e8192c]' : 'text-gray-500'}`} />
            </div>
            <p className="mt-4 text-xs font-black uppercase text-gray-400 tracking-widest">
              {step === 0 ? 'Drag & Drop Base File' : 'File Uploaded'}
            </p>
          </div>

          <ChevronRight className={`hidden md:block w-8 h-8 text-white/20 transition-all ${step === 1 ? 'text-[#ff2d3f] animate-pulse' : ''}`} />

          {/* Step 2: Processing */}
          <div className={`flex flex-col items-center flex-1 w-full transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-20 scale-95 grayscale'}`}>
            <div className="flex items-center justify-center w-full max-w-sm mb-4 bg-[#0a0b10] border border-white/10 rounded-full h-8 overflow-hidden relative">
              {step === 1 && (
                 <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0055ff] to-[#ff2d3f] animate-[grow_2.5s_ease-in-out_forwards]" style={{width: '20%'}}>
                   <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-[5px] animate-[slide_1s_infinite]" />
                 </div>
              )}
              {step === 2 && <div className="absolute left-0 top-0 h-full w-full bg-[#4ade80]" />}
              
              <p className="relative z-10 text-[10px] font-black tracking-widest text-white uppercase mix-blend-difference">
                 {step === 1 ? 'AI Analyzing Maps...' : step === 2 ? 'Processing Complete' : 'Waiting on data'}
              </p>
            </div>
            <div className="flex items-center justify-center text-[#ff2d3f] text-sm font-bold">
               {step === 1 && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
               {step === 1 && 'Applying Stage 1 Logic & Checksums'}
            </div>
          </div>

          <ChevronRight className={`hidden md:block w-8 h-8 text-white/20 transition-all ${step === 2 ? 'text-[#4ade80]' : ''}`} />

          {/* Step 3: Output */}
          <div className={`flex flex-col items-center transition-all duration-500 ${step === 2 ? 'opacity-100 scale-100 shadow-[0_0_30px_rgba(0,255,136,0.3)]' : 'opacity-20 scale-95'}`}>
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center border ${step === 2 ? 'border-[#4ade80] bg-[#4ade80]/10' : 'border-white/10 bg-black'}`}>
              <CheckCircle className={`w-10 h-10 ${step === 2 ? 'text-[#4ade80]' : 'text-gray-600'}`} />
            </div>
            <p className="mt-4 text-xs font-black uppercase text-gray-400 tracking-widest flex items-center">
              <File className="w-3 h-3 mr-1" /> Stage 1 Ready
            </p>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}} />
    </div>
  );
}

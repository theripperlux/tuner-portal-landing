"use client";

import React, { useState, useEffect } from 'react';
import stepsData from '@/content/setup-steps.json';
import { LucideChevronRight, LucideChevronLeft, LucideGlobe, LucideCopy, LucideCheck, LucideSettings } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

const CopyableField = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 mt-2 mb-4 bg-gray-50 dark:bg-[#050505] border border-black/10 dark:border-white/10 rounded-md p-2 shadow-sm">
      <code className="flex-1 text-sm text-black dark:text-white overflow-x-auto whitespace-nowrap">{text}</code>
      <button 
        onClick={handleCopy} 
        title="In Zwischenablage kopieren"
        className="p-2 bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 text-[#e8192c] dark:text-[#ff2d3f] hover:bg-[#e8192c]/20 dark:hover:bg-[#ff2d3f]/20 rounded transition-colors shrink-0"
      >
        {copied ? <LucideCheck className="w-4 h-4" /> : <LucideCopy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default function SetupGuide() {
  const [domain, setDomain] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  const locale = useLocale();
  const tGuide = useTranslations('SetupGuide');

  // Load domain from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedDomain = localStorage.getItem('tunerportal_admin_domain');
    if (savedDomain) {
      setDomain(savedDomain);
    }
  }, []);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDomain(val);
    const cleanDomain = val.replace(/^https?:\/\//, '').replace(/\/$/, '');
    localStorage.setItem('tunerportal_admin_domain', cleanDomain);
  };

  const currentStep = stepsData[currentStepIndex];
  const tStep = (currentStep.translations as any)[locale] || currentStep.translations['en'];

  // Advanced text parser supporting HTML, markdown links, dynamic paths, and Copyable fields
  const renderDescription = (text: string) => {
    // 1. Convert markdown links [Text](URL)
    let parsed = text.replace(/\[(.*?)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" class="text-[#e8192c] dark:text-[#ff2d3f] hover:underline font-medium">$1</a>');
    
    // 2. Convert **bold** to <strong>
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black dark:text-white">$1</strong>');
    
    // 3. Convert (/path) to clickable domain paths
    const displayDomain = domain.trim() ? domain.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'admin.example.com';
    parsed = parsed.replace(/\(\/([a-zA-Z0-9_\-\/]+)\)/g, `(<a href="https://${displayDomain}/$1" target="_blank" class="text-[#e8192c] dark:text-[#ff2d3f] hover:underline font-mono text-xs bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10">https://${displayDomain}/$1</a>)`);

    // 4. Split by [[COPY:...]] to render actual React components dynamically
    const copyRegex = /\[\[COPY:(.*?)\]\]/g;
    const parts = parsed.split(copyRegex);

    return (
      <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-4">
        {parts.map((part, i) => {
          // Odd indices are the captured strings inside [[COPY: ... ]]
          if (i % 2 === 1) {
            return <CopyableField key={i} text={part} />;
          }
          // Even indices are normal text/HTML
          return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
        })}
      </div>
    );
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  const displayDomain = domain.trim() ? domain.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'admin.example.com';

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-8 space-y-6">
      
      {/* Header with Domain Input */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-6 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-black dark:text-white">
            <LucideSettings className="w-8 h-8 text-[#e8192c] dark:text-[#ff2d3f]" />
            {tGuide('title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{tGuide('subtitle')}</p>
        </div>
        
        <div className="w-full md:w-auto min-w-[300px]">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 block uppercase tracking-widest">
            {tGuide('domainLabel')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <LucideGlobe className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input 
              type="text" 
              value={domain}
              onChange={handleDomainChange}
              placeholder={tGuide('domainPlaceholder')}
              className="w-full pl-10 p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-black dark:text-white focus:ring-2 focus:ring-[#e8192c] dark:focus:ring-[#ff2d3f] outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5 mb-8 overflow-hidden shadow-inner">
        <div 
          className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStepIndex + 1) / stepsData.length) * 100}%` }}
        />
      </div>

      {/* Main Content Grid (12 cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Navigation Menu (Col-span-3) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 shadow-sm rounded-2xl overflow-hidden flex flex-col max-h-[80vh] lg:sticky top-24">
          <div className="p-4 border-b border-black/5 dark:border-white/5 bg-gray-50 dark:bg-white/5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">{tGuide('overviewTitle')}</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {stepsData.map((step, idx) => {
              const stepTrans = (step.translations as any)[locale] || step.translations['en'];
              const isActive = currentStepIndex === idx;
              const isPast = currentStepIndex > idx;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex items-center justify-between group ${
                    isActive 
                      ? 'bg-black dark:bg-white text-white dark:text-black font-medium shadow-md' 
                      : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="truncate pr-2">{step.stepNumber || (idx + 1)}. {stepTrans.title.split(' (')[0]}</span>
                  {isPast && !isActive && <LucideCheck className="w-4 h-4 text-[#16a34a] dark:text-[#4ade80] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Instructions (Col-span-4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 shadow-md p-6 rounded-3xl flex-grow">
            <div className="flex flex-col gap-3 mb-5">
              <h2 className="text-2xl font-bold text-black dark:text-white leading-tight">{tStep.title}</h2>
              <a 
                href={`https://${displayDomain}${currentStep.path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Im Admin-Panel öffnen"
                className="self-start text-xs font-mono bg-[#e8192c]/10 dark:bg-[#ff2d3f]/10 text-[#e8192c] dark:text-[#ff2d3f] border border-[#e8192c]/20 dark:border-[#ff2d3f]/20 hover:bg-[#ef4444] dark:hover:bg-[#ff2d3f] hover:text-white dark:hover:text-black px-3 py-1.5 rounded-lg transition-colors break-all shadow-sm"
              >
                https://{displayDomain}{currentStep.path}
              </a>
            </div>
            <hr className="border-black/5 dark:border-white/10" />
            {renderDescription(tStep.description)}
          </div>

          <div className="flex justify-between items-center pt-2 gap-4">
            <button 
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-black dark:text-white rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 transition-all font-medium shadow-sm"
            >
              <LucideChevronLeft className="w-5 h-5" /> {tGuide('btnBack')}
            </button>
            <button 
              onClick={() => setCurrentStepIndex(Math.min(stepsData.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === stepsData.length - 1}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
            >
              {tGuide('btnNext')} <LucideChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Screenshot (Col-span-5) */}
        <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-lg bg-gray-50 dark:bg-[#0a0a0a] min-h-[400px] lg:h-[80vh] flex items-center justify-center group border border-black/5 dark:border-white/10">
          <img 
            src={`/images/setup-guide/${currentStep.image}`} 
            alt={tStep.title}
            className="object-contain w-full h-full p-2 transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="text-gray-500 dark:text-gray-400 flex flex-col items-center p-8 text-center bg-gray-100/50 dark:bg-white/5 w-full h-full justify-center">
                  <div class="w-20 h-20 mb-6 rounded-2xl bg-white dark:bg-[#050505] border border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <span class="block mb-2 font-semibold text-lg text-black dark:text-white">${tGuide('screenshotMissing')}</span>
                  <p class="text-sm mb-6 max-w-xs leading-relaxed">${tGuide('screenshotSaveAt')}</p>
                  <code class="text-xs bg-white dark:bg-[#050505] border border-black/10 dark:border-white/10 px-3 py-2 rounded-lg text-[#e8192c] dark:text-[#ff2d3f] shadow-sm break-all">/public/images/setup-guide/${currentStep.image}</code>
                </div>
              `;
            }}
          />
        </div>

      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { ShieldCheck, HelpCircle, Save, PlayCircle, ChevronDown, ChevronLeft, Loader2, MessageCircle, AlertCircle, CheckCircle2, Clock, Check, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CopyButton } from '@/components/CopyButton';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const HOSTERS = ['United Domains', 'IONOS', 'Host Europe', 'Hetzner', 'netcup', 'OVHcloud', 'Gandi', 'Hostinger', 'GoDaddy', 'Namecheap', 'INWX', 'Infomaniak', 'All-Inkl', 'STRATO', 'DomainFactory', 'Bluehost', 'DreamHost', 'SiteGround', 'Porkbun', 'Dynadot', 'Squarespace Domains', 'Cloudflare', 'Tucows', 'Register.com', 'Network Solutions', 'Hover', 'AWS Route 53', 'Easyname', 'Checkdomain', 'Dogado', 'World4You', 'Mittwald', 'Raidboxes', 'FastComet', 'A2 Hosting', 'GreenGeeks', 'Liquid Web', 'ScalaHosting', 'Kinsta', 'WP Engine'].sort();

const STEP_TITLE_KEYS = ['detailsTitle', 'dnsSetup', 'step3Title'] as const;

function StepProgress({ step }: { step: 1 | 2 | 3 }) {
  const t = useTranslations('Dashboard');
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={twMerge(
                'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition-colors',
                n < step ? 'bg-red-500 border-red-500 text-white' :
                n === step ? 'bg-red-500/15 border-red-500 text-red-400' :
                'bg-white/5 border-white/10 text-gray-600'
              )}
            >
              {n < step ? <Check className="w-3.5 h-3.5" /> : n}
            </span>
            <span className={twMerge('text-[10px] font-medium hidden sm:block', n === step ? 'text-white' : 'text-gray-600')}>
              {t(STEP_TITLE_KEYS[i])}
            </span>
          </div>
          {i < 2 && <div className={twMerge('w-10 sm:w-16 h-px mx-1 sm:mx-2 mb-4 sm:mb-4', n < step ? 'bg-red-500' : 'bg-white/10')} />}
        </div>
      ))}
    </div>
  );
}

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const alreadyRegistered =
    user.tenantStatus === 'pending' ||
    user.tenantOnboardingStatus === 'completed';
  const isApproved = user.tenantStatus === 'active';

  // Already-registered users land straight on the status step — no reason
  // to walk them back through disabled fields they already filled in.
  const [step, setStep] = useState<1 | 2 | 3>(alreadyRegistered || isApproved ? 3 : 1);
  const [stepError, setStepError] = useState('');
  const [selectedHoster, setSelectedHoster] = useState('IONOS');
  const [showVideo, setShowVideo] = useState(false);
  const [showHosterSteps, setShowHosterSteps] = useState(false);
  const [form, setForm] = useState({
    companyName: user.companyName || '',
    phone: user.phone || '',
    adminDomain: user.adminDomain || '',
    customerDomain: user.customerDomain || '',
  });
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState('');

  const update = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value });

  const goToStep2 = () => {
    if (!form.companyName.trim() || !form.phone.trim()) {
      setStepError(t('stepValidationError'));
      return;
    }
    setStepError('');
    setStep(2);
  };

  const goToStep3 = () => {
    if (!form.customerDomain.trim() || !form.adminDomain.trim()) {
      setStepError(t('stepValidationError'));
      return;
    }
    if (form.adminDomain.trim() === form.customerDomain.trim()) {
      setStepError(t('stepValidationError'));
      return;
    }
    setStepError('');
    setStep(3);
  };

  const saveSettings = async () => {
    setSubmitting(true);
    setRegError('');
    setMsg('');

    const res = await fetch('/api/user/settings', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      setRegError(t('saveError'));
      setSubmitting(false);
      return;
    }

    const reg = await fetch('/api/tenant/register', { method: 'POST' });
    const data = await reg.json().catch(() => ({}));

    if (reg.ok) {
      setMsg(t('activationMessage', {
        admin: form.adminDomain || 'admin.your-domain.com',
        customer: form.customerDomain || 'portal.your-domain.com',
      }));
    } else {
      setRegError(data.error || t('regError'));
    }
    setSubmitting(false);
    router.refresh();
  };

  const hosterKey = `hosterInstr_${selectedHoster.replace(/[^a-zA-Z]/g, '')}`;
  const hosterSteps = (t.has(hosterKey as any) ? t(hosterKey as any) : t('hosterInstr_generic')).split('|');

  return (
    <div className="fixed inset-0 bg-[#050505] text-gray-200 flex flex-col items-center justify-start overflow-y-auto z-[100] h-screen w-screen">
      <div className="fixed inset-0 bg-[url('/tech-bg.png')] bg-cover bg-center opacity-[0.08] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-500/[0.06] rounded-full blur-[150px] pointer-events-none" />

      {/* Slim navbar */}
      <div className="w-full sticky top-0 z-30 bg-[#0a0a0a]/90 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto w-full h-14 flex items-center justify-between px-4 sm:px-6">
          <Image src="/logo.png" alt="Logo" width={130} height={34} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] shrink-0" priority />
          <div className="flex items-center gap-2">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <SignOutButton />
          </div>
        </div>
      </div>

      {/* Single-column focused wizard — only the active step is shown, so
          getting to the actual inputs never requires scrolling past
          content for steps you're not on yet. */}
      <div className="max-w-2xl w-full px-4 sm:px-6 relative z-10 pt-6 pb-10">
        <StepProgress step={step} />

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-7">

          {step === 1 && (
            <div>
              <h1 className="text-lg font-semibold text-white mb-1">{t('detailsTitle')}</h1>
              <p className="text-xs text-gray-500 mb-5">{t('detailsDesc')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">{t('companyName')}</label>
                  <input type="text" value={form.companyName} onChange={update('companyName')} className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">{t('phone')}</label>
                  <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+49 ..." className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600" />
                </div>
              </div>

              {stepError && <p className="text-xs text-red-400 mb-3">{stepError}</p>}

              <button type="button" onClick={goToStep2} className="w-full mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition-all">
                {t('stepContinueBtn')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors mb-3">
                <ChevronLeft className="w-3.5 h-3.5" /> {t('stepBack')}
              </button>
              <h1 className="text-lg font-semibold text-white mb-1">{t('dnsSetup')}</h1>
              <p className="text-xs text-gray-500 mb-4">{t('step2Desc')}</p>

              <div className="flex items-start gap-2.5 bg-red-500/[0.06] border border-red-500/15 rounded-xl px-4 py-3 mb-5">
                <HelpCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  {t('domainHelpBanner')}{' '}
                  <Link href="mailto:support@tunerportal.com" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                    {t('contactSupport')}
                  </Link>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">{t('portalDomain')}</label>
                  <input type="text" value={form.customerDomain} onChange={update('customerDomain')} placeholder="portal.your-domain.com" className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">{t('adminDomain')}</label>
                  <input type="text" value={form.adminDomain} onChange={update('adminDomain')} placeholder="admin.your-domain.com" className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600" />
                </div>
                <p className="sm:col-span-2 text-[11px] text-gray-500 leading-relaxed">{t('domainHint')}</p>
              </div>

              <div className="bg-black/30 rounded-xl overflow-hidden border border-white/10 mb-4">
                <div className="bg-white/[0.04] border-b border-white/10 px-4 py-2.5 grid grid-cols-12 gap-3 text-[11px] font-bold text-gray-400 tracking-wide uppercase">
                  <div className="col-span-5">{t('cnameSubdomainUsage')}</div>
                  <div className="col-span-7">{t('cnameTargetValue')}</div>
                </div>
                <div className="border-b border-white/10 px-4 py-3 grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5">
                    <span className="inline-block px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/20 text-[10px] font-bold rounded uppercase mb-1">{t('cnameForAdmin')}</span>
                    <p className={twMerge('text-sm font-semibold', form.adminDomain ? 'text-white' : 'text-gray-500 italic font-normal')}>{form.adminDomain || t('adminDomain')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t('cnameType')}</p>
                  </div>
                  <div className="col-span-7 flex items-center gap-2">
                    <p className="flex-1 min-w-0 text-gray-300 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 select-all truncate">70d64f5d10ce3321.vercel-dns-017.com.</p>
                    <CopyButton value="70d64f5d10ce3321.vercel-dns-017.com." />
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5">
                    <span className="inline-block px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded uppercase mb-1">{t('cnameForCustomers')}</span>
                    <p className={twMerge('text-sm font-semibold', form.customerDomain ? 'text-white' : 'text-gray-500 italic font-normal')}>{form.customerDomain || t('portalDomain')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t('cnameType')}</p>
                  </div>
                  <div className="col-span-7 flex items-center gap-2">
                    <p className="flex-1 min-w-0 text-gray-300 text-xs font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 select-all truncate">2145f1913d58fb07.vercel-dns-017.com.</p>
                    <CopyButton value="2145f1913d58fb07.vercel-dns-017.com." />
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-4 flex items-start bg-white/5 p-2.5 rounded-lg border border-white/10">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-gray-500" />
                <span>{t('cnameDotNote')}</span>
              </p>

              <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white/[0.02]">
                  <label className="text-xs font-medium text-white/60 shrink-0">{t('selectHoster')}</label>
                  <select
                    value={selectedHoster}
                    onChange={(e) => { setSelectedHoster(e.target.value); setShowHosterSteps(true); }}
                    className="flex-1 max-w-[220px] bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all cursor-pointer"
                  >
                    {HOSTERS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHosterSteps(v => !v)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border-t border-white/10 bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <span className="text-xs font-semibold text-gray-300">{t('hosterInstructionsFor', { name: selectedHoster })}</span>
                  <ChevronDown className={twMerge('w-4 h-4 text-gray-500 transition-transform duration-200', showHosterSteps && 'rotate-180')} />
                </button>
                {showHosterSteps && (
                  <div className="px-4 pb-4 pt-1 border-t border-white/10 bg-black/20">
                    <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1.5 leading-relaxed">
                      {hosterSteps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowVideo(v => !v)}
                className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-white bg-white/[0.02] hover:bg-white/5 border border-white/10 rounded-xl py-2.5 transition-all"
              >
                <PlayCircle className="w-4 h-4" /> {t('videoTutorialToggle')}
              </button>
              {showVideo && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  <video controls className="w-full h-auto max-h-[400px] object-cover bg-black" preload="metadata">
                    <source src="/videos/setup-domain.mp4" type="video/mp4" />
                    {t('videoUnsupported')}
                  </video>
                </div>
              )}

              <p className="text-xs text-amber-400/80 mt-4 flex items-center bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0" /> {t('sslInfo')}
              </p>

              {stepError && <p className="text-xs text-red-400 mt-3">{stepError}</p>}

              <button type="button" onClick={goToStep3} className="w-full mt-5 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition-all">
                {t('stepContinueBtn')}
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              {!alreadyRegistered && !isApproved && (
                <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors mb-3">
                  <ChevronLeft className="w-3.5 h-3.5" /> {t('stepBack')}
                </button>
              )}
              <h1 className="text-lg font-semibold text-white mb-1">{t('step3Title')}</h1>
              <p className="text-xs text-gray-500 mb-5">{t('step3Desc')}</p>

              {isApproved ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-emerald-400 font-semibold text-sm">{t('regApprovedTitle')}</p>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{t('regApprovedInfo')}</p>
                  </div>
                </div>
              ) : alreadyRegistered ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-semibold text-sm">{t('regPendingTitle')}</p>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">{t('regPendingInfo')}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">{t('companyName')}</span><span className="text-white font-medium">{form.companyName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t('portalDomain')}</span><span className="text-white font-medium">{form.customerDomain}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">{t('adminDomain')}</span><span className="text-white font-medium">{form.adminDomain}</span></div>
                  </div>

                  <button type="button" onClick={saveSettings} disabled={submitting} className="flex items-center justify-center w-full px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {submitting ? t('saving') : t('registerPortal')}
                  </button>
                  {msg && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mt-4">
                      <p className="text-sm font-semibold text-emerald-400 whitespace-pre-wrap leading-relaxed">{msg}</p>
                    </div>
                  )}
                  {regError && (
                    <div className="mt-4 p-3 bg-red-500/10 text-red-400 text-sm text-center border border-red-500/20 rounded-xl">
                      {regError}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Support — one unobtrusive line, always reachable, not a competing card */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('onboardingSidebarNote')}</span>
          <Link href="mailto:support@tunerportal.com" className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-medium transition-colors">
            <MessageCircle className="w-3.5 h-3.5" /> {t('contactSupport')}
          </Link>
        </div>
      </div>
    </div>
  );
}

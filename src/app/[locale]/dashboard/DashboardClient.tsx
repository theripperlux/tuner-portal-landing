'use client';
import { useState } from 'react';
import { ShieldCheck, Globe, Save, HelpCircle, PlayCircle, ChevronDown, Building2, Loader2, MessageCircle, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CopyButton } from '@/components/CopyButton';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const HOSTERS = ['United Domains', 'IONOS', 'Host Europe', 'Hetzner', 'netcup', 'OVHcloud', 'Gandi', 'Hostinger', 'GoDaddy', 'Namecheap', 'INWX', 'Infomaniak', 'All-Inkl', 'STRATO', 'DomainFactory', 'Bluehost', 'DreamHost', 'SiteGround', 'Porkbun', 'Dynadot', 'Squarespace Domains', 'Cloudflare', 'Tucows', 'Register.com', 'Network Solutions', 'Hover', 'AWS Route 53', 'Easyname', 'Checkdomain', 'Dogado', 'World4You', 'Mittwald', 'Raidboxes', 'FastComet', 'A2 Hosting', 'GreenGeeks', 'Liquid Web', 'ScalaHosting', 'Kinsta', 'WP Engine'].sort();

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-xs shrink-0">
      {n}
    </span>
  );
}

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const t = useTranslations('Dashboard');
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
  const alreadyRegistered =
    user.tenantStatus === 'pending' ||
    user.tenantOnboardingStatus === 'completed';
  const isApproved = user.tenantStatus === 'active';

  const update = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value });

  const saveSettings = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setRegError('');
    setMsg('');

    // 1. Persist the company + domain settings locally.
    const res = await fetch('/api/user/settings', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      setRegError(t('saveError'));
      setSubmitting(false);
      return;
    }

    // 2. Forward to the backend tenant-registration API (idempotent).
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
      {/* Subtle brand-consistent background — single red accent, no competing colors */}
      <div className="fixed inset-0 bg-[url('/tech-bg.png')] bg-cover bg-center opacity-[0.08] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-500/[0.06] rounded-full blur-[150px] pointer-events-none" />

      {/* App Navbar */}
      <div className="w-full sticky top-0 z-30 bg-[#0a0a0a]/90 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto w-full h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 min-w-0">
            <Image src="/logo.png" alt="Logo" width={150} height={38} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] shrink-0" priority />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="https://wa.me/352661293088" target="_blank" className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:text-white bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 px-3 py-2 rounded-lg transition-all">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Link>
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(user.companyName?.trim()?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col leading-tight min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[160px]">{user.companyName || user.email}</span>
                {user.companyName && <span className="text-[10px] text-gray-500 truncate max-w-[160px]">{user.email}</span>}
              </div>
            </div>

            <SignOutButton />
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full px-4 sm:px-6 relative z-10 pt-8 pb-16">

        {/* Intro */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">{t('onboardingTitle')}</h1>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed text-sm">{t('onboardingSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">

            <form onSubmit={saveSettings} className="space-y-5">

              {/* Step 1: Your details — business info + domains together, one card */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <StepBadge n={1} />
                  <div>
                    <h2 className="text-white font-semibold text-base leading-tight">{t('detailsTitle')}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{t('detailsDesc')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">{t('companyName')}</label>
                    <input type="text" value={form.companyName} onChange={update('companyName')} disabled={alreadyRegistered} className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">{t('phone')}</label>
                    <input type="tel" value={form.phone} onChange={update('phone')} disabled={alreadyRegistered} placeholder="+49 ..." className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">{t('portalDomain')}</label>
                    <input type="text" value={form.customerDomain} onChange={update('customerDomain')} disabled={alreadyRegistered} placeholder="portal.your-domain.com" className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">{t('adminDomain')}</label>
                    <input type="text" value={form.adminDomain} onChange={update('adminDomain')} disabled={alreadyRegistered} placeholder="admin.your-domain.com" className="w-full bg-black/40 border border-white/10 px-3.5 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50" />
                  </div>
                  <p className="sm:col-span-2 text-[11px] text-gray-500 leading-relaxed">{t('domainHint')}</p>
                </div>
              </div>

              {/* DNS setup — CNAME records reflect the domains entered above */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 border border-white/10 text-gray-400 shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h2 className="text-white font-semibold text-base leading-tight">{t('dnsSetup')}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{t('step2Desc')}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-black/10 mb-4">
                  <div className="bg-[#f8f9fa] border-b border-black/5 px-4 py-2.5 grid grid-cols-12 gap-3 text-[11px] font-bold text-[#1f2937] tracking-wide uppercase">
                    <div className="col-span-5">{t('cnameSubdomainUsage')}</div>
                    <div className="col-span-7">{t('cnameTargetValue')}</div>
                  </div>

                  <div className="bg-white border-b border-black/5 px-4 py-3 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase mb-1">{t('cnameForAdmin')}</span>
                      <p className={twMerge('text-sm font-semibold', form.adminDomain ? 'text-[#0052cc]' : 'text-gray-400 italic font-normal')}>{form.adminDomain || t('adminDomain')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t('cnameType')}</p>
                    </div>
                    <div className="col-span-7 flex items-center gap-2">
                      <p className="flex-1 min-w-0 text-gray-700 text-xs font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 select-all truncate">70d64f5d10ce3321.vercel-dns-017.com.</p>
                      <CopyButton value="70d64f5d10ce3321.vercel-dns-017.com." />
                    </div>
                  </div>

                  <div className="bg-white px-4 py-3 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-5">
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase mb-1">{t('cnameForCustomers')}</span>
                      <p className={twMerge('text-sm font-semibold', form.customerDomain ? 'text-[#0052cc]' : 'text-gray-400 italic font-normal')}>{form.customerDomain || t('portalDomain')}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t('cnameType')}</p>
                    </div>
                    <div className="col-span-7 flex items-center gap-2">
                      <p className="flex-1 min-w-0 text-gray-700 text-xs font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 select-all truncate">2145f1913d58fb07.vercel-dns-017.com.</p>
                      <CopyButton value="2145f1913d58fb07.vercel-dns-017.com." />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-4 flex items-start bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-gray-500" />
                  <span>{t('cnameDotNote')}</span>
                </p>

                {/* Hoster picker — instructions collapsed by default, expand only if needed */}
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
                        {hosterSteps.map((step, i) => <li key={i}>{step}</li>)}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Optional video walkthrough — collapsed by default */}
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
              </div>

              {/* Step 2: Activate */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <StepBadge n={2} />
                  <div>
                    <h2 className="text-white font-semibold text-base leading-tight">{t('step3Title')}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{t('step3Desc')}</p>
                  </div>
                </div>

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
                    <button type="submit" disabled={submitting} className="flex items-center justify-center w-full px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
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
            </form>
          </div>

          {/* Support — always available, no gating on setup completion */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-5 h-5 text-gray-500" />
              <h2 className="text-white font-semibold text-base">{t('support')}</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">{t('supportDesc')}</p>
            <Link href="mailto:support@tunerportal.com" className="w-full flex justify-center items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-all border border-white/10">
              <MessageCircle className="w-4 h-4 mr-2" /> {t('contactSupport')}
            </Link>
            <div className="mt-5 pt-5 border-t border-white/10 flex items-start gap-3">
              <Building2 className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">{t('onboardingSidebarNote')}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

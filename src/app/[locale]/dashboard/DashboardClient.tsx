'use client';
import { useState } from 'react';
import { ShieldCheck, Globe, Save, HelpCircle, Send, LogOut, ArrowLeft, Image as ImageIcon, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export default function DashboardClient({ user }: { user: any }) {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [selectedHoster, setSelectedHoster] = useState('IONOS');
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

  const update = (f: string) => (e: any) => setForm({ ...form, [f]: e.target.value });

  const saveSettings = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setRegError('');
    setMsg(t('saving'));

    // 1. Persist the company + domain settings locally.
    const res = await fetch('/api/user/settings', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    if (!res.ok) {
      setMsg('');
      setRegError(t('saveError'));
      setSubmitting(false);
      return;
    }

    // 2. Forward to the backend tenant-registration API (idempotent).
    const reg = await fetch('/api/tenant/register', { method: 'POST' });
    const data = await reg.json().catch(() => ({}));

    if (reg.ok) {
      setMsg(`Die Aktivierung kann 1-5 Stunden dauern, bis das Portal vollständig läuft unter:\nAdmin: ${form.adminDomain || 'admin.deine-domain.com'}\nKunden: ${form.customerDomain || 'portal.deine-domain.com'}`);
    } else {
      setMsg('');
      setRegError(data.error || t('regError'));
    }
    setSubmitting(false);
    router.refresh();
  };


  return (
    <div className="fixed inset-0 bg-[#050505] text-gray-200 flex flex-col items-center justify-start overflow-y-auto z-[100] h-screen w-screen">
      {/* Immersive Blurred Background */}
      <div className="fixed inset-0 bg-[url('/tech-bg.png')] bg-cover bg-center opacity-30 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-[#e8192c]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-[#00f2ff]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed inset-0 backdrop-blur-2xl pointer-events-none z-0" />

      {/* Sleek App Navbar */}
      <div className="w-full sticky top-0 z-30 bg-[#0a0b10]/80 border-b border-white/10 backdrop-blur-xl mb-8">
        <div className="max-w-6xl mx-auto w-full h-16 flex items-center justify-between px-4 sm:px-6">
          {/* Left: logo + section label */}
          <div className="flex items-center gap-4 min-w-0">
            <Image src="/logo.png" alt="Logo" width={150} height={38} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] shrink-0" priority />
            <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-[0.15em] text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {t('config')}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="https://wa.me/352661293088" target="_blank" className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#25D366] hover:text-white bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 px-3 py-2 rounded-lg transition-all">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Link>
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />

            {/* User chip */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8192c] to-[#00f2ff] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-[0_0_12px_rgba(232,25,44,0.3)]">
                {(user.companyName?.trim()?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col leading-tight min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[160px]">{user.companyName || user.email}</span>
                {user.companyName && <span className="text-[10px] text-gray-500 truncate max-w-[160px]">{user.email}</span>}
              </div>
            </div>

            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 px-3 py-2 rounded-lg transition-all">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 pb-20">
        
        {/* Left Col: Setup & Domains */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-2xl">
             <h2 className="text-3xl font-semibold text-white mb-8 flex items-center tracking-tight">
                <Globe className="w-8 h-8 mr-4 text-white/80" />
                {t('domains')}
             </h2>

             {/* Tutorial Video Section */}
             <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/40">
                <div className="bg-[#00f2ff]/10 p-4 border-b border-white/10 flex items-center">
                   <Globe className="w-5 h-5 text-[#00f2ff] mr-3" />
                   <h3 className="text-white font-semibold text-sm">Video-Tutorial: So richtest du deine Domain ein</h3>
                </div>
                <video 
                   controls 
                   className="w-full h-auto max-h-[400px] object-cover bg-black"
                   preload="metadata"
                >
                   <source src="/videos/setup-domain.mp4" type="video/mp4" />
                   Dein Browser unterstützt das Video-Format leider nicht.
                </video>
             </div>

             <div className="bg-white/5 p-8 rounded-2xl border border-white/5 mb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-white font-medium text-lg">{t('dnsSetup')}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mt-1 whitespace-pre-wrap">{t('dnsInfo')}</p>
                  </div>
                  <div className="w-full md:w-64 shrink-0">
                    <label className="block text-xs font-medium text-white/60 mb-2 uppercase tracking-widest">{t('selectHoster')}</label>
                    <select 
                      value={selectedHoster} 
                      onChange={(e) => setSelectedHoster(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 px-4 py-2.5 rounded-xl text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 focus:ring-1 focus:ring-[#00f2ff]/50 transition-all appearance-none cursor-pointer hover:bg-black"
                    >
                      {['United Domains', 'IONOS', 'Host Europe', 'Hetzner', 'netcup', 'OVHcloud', 'Gandi', 'Hostinger', 'GoDaddy', 'Namecheap', 'INWX', 'Infomaniak', 'All-Inkl', 'STRATO', 'DomainFactory', 'Bluehost', 'DreamHost', 'SiteGround', 'Porkbun', 'Dynadot', 'Squarespace Domains', 'Cloudflare', 'Tucows', 'Register.com', 'Network Solutions', 'Hover', 'AWS Route 53', 'Easyname', 'Checkdomain', 'Dogado', 'World4You', 'Mittwald', 'Raidboxes', 'FastComet', 'A2 Hosting', 'GreenGeeks', 'Liquid Web', 'ScalaHosting', 'Kinsta', 'WP Engine'].sort().map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hoster Instructions Box */}
                <div className="bg-[#00f2ff]/5 border border-[#00f2ff]/20 p-5 rounded-2xl mb-8">
                   <h4 className="text-[#00f2ff] font-semibold text-sm mb-3 flex items-center">
                     <AlertCircle className="w-4 h-4 mr-2" /> Anleitung für {selectedHoster}
                   </h4>
                   <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2 leading-relaxed">
                     {t(`hosterInstr_${selectedHoster.replace(/[^a-zA-Z]/g, '')}`) === `hosterInstr_${selectedHoster.replace(/[^a-zA-Z]/g, '')}` 
                        ? t('hosterInstr_generic').split('|').map((step: string, i: number) => <li key={i}>{step}</li>)
                        : t(`hosterInstr_${selectedHoster.replace(/[^a-zA-Z]/g, '')}`).split('|').map((step: string, i: number) => <li key={i}>{step}</li>)
                     }
                   </ol>
                </div>

                {/* The Mock CNAME Table */}
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-black/10 mb-8">
                   <div className="bg-[#f8f9fa] border-b border-black/5 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-bold text-[#1f2937] tracking-wide uppercase">
                     <div className="col-span-5">{t('cnameSubdomainUsage')}</div>
                     <div className="col-span-7">{t('cnameTargetValue')}</div>
                   </div>
                   
                   {/* Row 1: Admin */}
                   <div className="bg-white border-b border-black/5 px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                     <div className="col-span-5">
                       <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase mb-1">{t('cnameForAdmin')}</span>
                       <p className="text-[#0052cc] text-sm font-semibold">{form.adminDomain || 'admin.deine-domain.com'}</p>
                       <p className="text-xs text-gray-400 mt-0.5">{t('cnameType')}</p>
                     </div>
                     <div className="col-span-7 flex flex-col items-start gap-2">
                       <p className="text-gray-700 text-sm font-mono bg-yellow-100 px-3 py-2 rounded-lg border-2 border-yellow-400 select-all font-bold shadow-sm w-full">70d64f5d10ce3321.vercel-dns-017.com.</p>
                       <span className="text-xs text-gray-500 font-medium flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {t('cnameEnterAtHoster')}</span>
                     </div>
                   </div>

                   {/* Row 2: Customer */}
                   <div className="bg-white px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                     <div className="col-span-5">
                       <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase mb-1">{t('cnameForCustomers')}</span>
                       <p className="text-[#0052cc] text-sm font-semibold">{form.customerDomain || 'portal.deine-domain.com'}</p>
                       <p className="text-xs text-gray-400 mt-0.5">{t('cnameType')}</p>
                     </div>
                     <div className="col-span-7 flex flex-col items-start gap-2">
                       <p className="text-gray-700 text-sm font-mono bg-yellow-100 px-3 py-2 rounded-lg border-2 border-yellow-400 select-all font-bold shadow-sm w-full">2145f1913d58fb07.vercel-dns-017.com.</p>
                       <span className="text-xs text-gray-500 font-medium flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> {t('cnameEnterAtHoster')}</span>
                     </div>
                   </div>
                </div>

                <p className="text-xs text-[#00f2ff]/90 mt-4 flex items-start bg-[#00f2ff]/10 p-3 rounded-lg border border-[#00f2ff]/20">
                  <AlertCircle className="w-4 h-4 mr-3 mt-0.5 shrink-0" />
                  <span>{t('cnameDotNote')}</span>
                </p>
                <p className="text-xs text-yellow-500/80 mt-3 flex items-center bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 mb-10">
                  <ShieldCheck className="w-4 h-4 mr-3" /> {t('sslInfo')}
                </p>
             </div>

             <form onSubmit={saveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-medium text-white/60 mb-2">{t('portalDomain')}</label>
                     <input type="text" value={form.customerDomain} onChange={update('customerDomain')} placeholder="portal.your-domain.com" className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-white/60 mb-2">{t('adminDomain')}</label>
                     <input type="text" value={form.adminDomain} onChange={update('adminDomain')} placeholder="admin.your-domain.com" className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
                   </div>
                   <p className="md:col-span-2 -mt-2 text-[11px] text-gray-500 leading-relaxed">
                     {t('domainHint')}
                   </p>
                   <div>
                     <label className="block text-xs font-medium text-white/60 mb-2">{t('companyName')}</label>
                     <input type="text" value={form.companyName} onChange={update('companyName')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-white/60 mb-2">{t('phone')}</label>
                     <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+49 ..." className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
                   </div>
                </div>

                <button type="submit" disabled={submitting || alreadyRegistered} className="flex items-center justify-center w-full px-6 py-4 bg-white hover:bg-gray-200 text-black font-semibold text-sm rounded-xl transition-all tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {submitting ? t('saving') : alreadyRegistered ? t('regSubmittedShort') : t('registerPortal')}
                </button>
                {msg && <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl text-center mt-4"><p className="text-sm font-semibold text-[#00ff88] whitespace-pre-wrap leading-relaxed">{msg}</p></div>}
                {regError && (
                  <div className="mt-4 p-3 bg-red-500/10 text-red-400 text-sm text-center border border-red-500/20 rounded-xl">
                    {regError}
                  </div>
                )}

                {user.tenantStatus === 'active' && (
                  <div className="mt-4 p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl text-center">
                    <p className="text-[#00ff88] font-semibold text-sm">{t('regApprovedTitle')}</p>
                    <p className="text-xs text-white/70 mt-1">{t('regApprovedInfo')}</p>
                  </div>
                )}

             </form>
           </div>
        </div>

        {/* Right Col: Support Status (Instead of Tickets) */}
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl h-fit">
           <h2 className="text-2xl font-semibold text-white mb-8 flex items-center tracking-tight">
             <HelpCircle className="w-6 h-6 mr-3 text-white/50" />
             {t('support')}
           </h2>
           <p className="text-sm text-gray-400 mb-6 leading-relaxed">
             Solltest du Fragen zur Einrichtung deiner Domain oder deines Portals haben, kannst du uns jederzeit kontaktieren. Dein Dashboard-Support-Modul wird freigeschaltet, sobald das Setup abgeschlossen ist.
           </p>
           <Link href="mailto:support@tunerportal.com" className="w-full flex justify-center items-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-all tracking-wide border border-white/10">
             <MessageCircle className="w-4 h-4 mr-2" /> Support kontaktieren
           </Link>
        </div>

      </div>
    </div>
  );
}

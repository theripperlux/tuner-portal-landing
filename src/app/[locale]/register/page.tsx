'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { CountrySelect } from '@/components/CountrySelect';
import { SiteNav } from '@/components/SiteNav';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    companyName: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    zip: '',
    country: '',
    euVat: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      router.push({ pathname: '/login', query: { registered: 'true' } } as any);
    } else {
      const data = await res.json();
      setError(data.error || t('registrationFailed'));
    }
    setLoading(false);
  };

  const update = (field: string) => (e: any) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e8192c]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-400/5 rounded-full blur-[150px] pointer-events-none" />

      <SiteNav />

      <div className="flex-1 flex items-center justify-center p-4 py-12 relative z-10">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
           <Image src="/logo.png" alt="Tunerportal Logo" width={220} height={50} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" priority />
        </div>
        <h2 className="text-2xl font-semibold text-white text-center mb-8 tracking-tight">{t('title')}</h2>
        {error && <div className="p-3 mb-6 bg-red-500/10 text-red-500 text-sm text-center border border-red-500/20 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

          <div className="space-y-4">
             <h3 className="text-white/60 font-medium text-sm mb-4 border-b border-white/10 pb-2">{t('step1Title')}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input type="email" placeholder={t('emailPlaceholder')} required onChange={update('email')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
                </div>
                <div>
                  <input type="password" placeholder={t('passwordPlaceholder')} required minLength={8} onChange={update('password')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-white/60 font-medium text-sm mb-4 border-b border-white/10 pb-2">{t('step2Title')}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="md:col-span-2">
                  <input type="text" placeholder={t('companyNamePlaceholder')} onChange={update('companyName')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
               </div>
               <div>
                  <input type="text" placeholder={t('firstNamePlaceholder')} required onChange={update('firstName')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600" />
               </div>
               <div>
                  <input type="text" placeholder={t('lastNamePlaceholder')} required onChange={update('lastName')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600" />
               </div>
               <div className="md:col-span-2">
                  <input type="tel" placeholder={t('phonePlaceholder')} required minLength={4} onChange={update('phone')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600" />
               </div>
               <div className="md:col-span-2">
                  <input type="text" placeholder={t('addressPlaceholder')} required onChange={update('address')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600" />
               </div>
               <div>
                  <input type="text" placeholder={t('zipPlaceholder')} required onChange={update('zip')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600" />
               </div>
               <div>
                  <CountrySelect value={form.country} onChange={(code) => setForm({ ...form, country: code })} required />
               </div>
               <div className="md:col-span-2">
                  <input type="text" placeholder={t('euVatPlaceholder')} onChange={update('euVat')} className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-600" />
               </div>
             </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide text-sm flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t('creating')}</>
            ) : (
              <>{t('submitBtn')}</>
            )}
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-8 text-center relative z-10">
          {t('alreadyActive')} <Link href="/login" className="text-white hover:underline transition-all">{t('signIn')}</Link>
        </p>
      </div>
      </div>
    </div>
  );
}

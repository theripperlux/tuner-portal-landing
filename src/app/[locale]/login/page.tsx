'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError(t('loginFailed'));
      setLoading(false);
    } else {
      const session = await getSession();
      if ((session?.user?.role === 'ADMIN' || session?.user?.email === 'info@deepxclusive.com' || session?.user?.email === 'info@tunerportal.com')) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      // Keep the spinner up while we navigate away.
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#e8192c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-400/10 rounded-full blur-[100px] pointer-events-none" />

      <SiteNav />

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-8">
           <Image src="/logo.png" alt="Tunerportal Logo" width={220} height={50} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]" priority />
        </div>

        <h2 className="text-2xl font-semibold text-white text-center mb-2 tracking-tight">{t('welcomeBack')}</h2>
        <p className="text-gray-400 text-sm text-center mb-8">{t('subtitle')}</p>

        {error && <div className="p-3 mb-6 bg-red-500/10 text-red-500 text-sm text-center border border-red-500/20 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input type="email" placeholder={t('emailPlaceholder')} value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
          </div>
          <div>
            <input type="password" placeholder={t('passwordPlaceholder')} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600" />
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">
                {t('forgotPassword')}
              </Link>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-2 bg-white text-black hover:bg-gray-200 font-semibold py-3 rounded-xl transition-all tracking-wide text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t('signingIn')}</>
            ) : (
              <>{t('continueBtn')}</>
            )}
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-8 text-center">
          {t('noPortal')} <Link href="/register" className="text-white hover:underline transition-all">{t('applyNow')}</Link>
        </p>
      </div>
      </div>
    </div>
  );
}

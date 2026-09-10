'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { SiteNav } from '@/components/SiteNav';
import { Link } from '@/i18n/routing';

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPasswordPage');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrorMessage(data.error || t('genericError'));
        setStatus('error');
      }
    } catch (err) {
      setErrorMessage(t('connectionError'));
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden transition-colors">
      <SiteNav />

      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#e8192c]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToLogin')}
          </Link>
          <h1 className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e8192c] to-red-400"></div>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{t('emailSentTitle')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('emailSentDesc', { email })}
              </p>
              <Link href="/login" className="inline-block w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">
                {t('backToLoginBtn')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 text-black dark:text-white pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 transition-all placeholder:text-gray-400"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                  <p className="text-sm text-red-500 font-semibold">{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold flex items-center justify-center hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('requestLinkBtn')} <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

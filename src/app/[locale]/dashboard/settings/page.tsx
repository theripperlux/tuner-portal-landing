import { getTranslations } from 'next-intl/server';

export default async function BaseSettings() {
  const t = await getTranslations('DashboardSettings');
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm">
          {t('saveBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('companyDetailsTitle')}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('companyNameLabel')}</label>
              <input type="text" id="companyName" placeholder={t('companyNamePlaceholder')} className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('addressLabel')}</label>
              <textarea id="companyAddress" rows={3} placeholder={t('addressPlaceholder')} className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
            </div>
            <div>
              <label htmlFor="companyVat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vatIdLabel')}</label>
              <input type="text" id="companyVat" placeholder={t('vatIdPlaceholder')} className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* SMTP Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('smtpTitle')}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('smtpHostLabel')}</label>
              <input type="text" id="smtpHost" placeholder={t('smtpHostPlaceholder')} className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('portLabel')}</label>
                <input type="number" id="smtpPort" placeholder="587" className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
              <div>
                <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('usernameLabel')}</label>
                <input type="text" id="smtpUser" placeholder={t('usernamePlaceholder')} className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="smtpPass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('passwordLabel')}</label>
              <input type="password" id="smtpPass" placeholder="••••••••" className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

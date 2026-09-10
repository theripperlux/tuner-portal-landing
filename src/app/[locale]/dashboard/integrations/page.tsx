import { getTranslations } from 'next-intl/server';

export default async function IntegrationsSettings() {
  const t = await getTranslations('DashboardIntegrations');
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

      <div className="space-y-6">
        {/* Payment Gateways */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('paymentGatewaysTitle')}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="stripeKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stripeLabel')}</label>
              <input type="password" id="stripeKey" placeholder="sk_test_..." className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="paypalKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('paypalLabel')}</label>
              <input type="password" id="paypalKey" placeholder="AfX..." className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Business APIs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('businessUtilitiesTitle')}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="winolsKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('winolsLabel')}</label>
              <input type="password" id="winolsKey" placeholder="EVC-..." className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="vatCheckerKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('vatCheckerLabel')}</label>
              <input type="password" id="vatCheckerKey" placeholder="VIES-..." className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

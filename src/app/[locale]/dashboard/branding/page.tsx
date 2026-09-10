import { getTranslations } from 'next-intl/server';

export default async function BrandingSettings() {
  const t = await getTranslations('DashboardBranding');
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">

        {/* Colors Section */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('colorsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('primaryColor')}</label>
              <div className="mt-2 flex items-center gap-3">
                <input type="color" id="primaryColor" defaultValue="#2563eb" className="h-10 w-10 border-0 rounded p-0 cursor-pointer" />
                <input type="text" defaultValue="#2563eb" className="block flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" />
              </div>
            </div>

            <div>
              <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('secondaryColor')}</label>
              <div className="mt-2 flex items-center gap-3">
                <input type="color" id="secondaryColor" defaultValue="#1e40af" className="h-10 w-10 border-0 rounded p-0 cursor-pointer" />
                <input type="text" defaultValue="#1e40af" className="block flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border" />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('logoTitle')}</h2>
          <div className="mt-2 flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12A4 4 0 008 12v24a4 4 0 004 4h24a4 4 0 004-4V20L28 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-300">
              <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>{t('uploadFile')}</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              </span>
              <p className="pl-1">{t('orDragDrop')}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('fileHint')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

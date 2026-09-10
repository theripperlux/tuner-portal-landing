import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'de', 'fr', 'es', 'it', 'nl', 'ar', 'zh', 'no', 'pt', 'ru', 'sv'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/', '/(de|en|fr|es|it|nl|ar|zh|no|pt|ru|sv)/:path*']
};

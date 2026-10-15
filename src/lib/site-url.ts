/** Public origin of the website, for absolute URLs (metadata, sitemap). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://malabarchallengersfc.com"
).replace(/\/+$/, "");

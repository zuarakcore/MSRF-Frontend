declare namespace NodeJS {
  interface ProcessEnv {
    /** Base URL of the MSRF backend API, e.g. https://api.malabarchallengersfc.com/api/v1 */
    readonly NEXT_PUBLIC_API_BASE_URL?: string;
    /** Cloudflare Turnstile site key (public). Unset hides the spam check on public forms. */
    readonly NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
    /** Public site origin for absolute URLs (sitemap, Open Graph), e.g. https://malabarchallengersfc.com */
    readonly NEXT_PUBLIC_SITE_URL?: string;
  }
}

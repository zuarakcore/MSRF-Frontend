declare namespace NodeJS {
  interface ProcessEnv {
    /** Base URL of the MSRF backend API, e.g. http://localhost:8000/api/v1 */
    readonly NEXT_PUBLIC_API_BASE_URL?: string;
  }
}

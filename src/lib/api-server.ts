/**
 * Server-side reads of the backend's `/public/*` content, so programmes, team and jobs are in the HTML
 * that search engines and link previews see. The API marks these responses cacheable for 60 seconds,
 * and Next keeps them in its data cache for the same time.
 *
 * Failures return undefined instead of throwing: the page still renders and the browser fetches the
 * content itself, exactly as before.
 */
import { API_BASE_URL, type Job, type Programme, type TeamMember } from "@/lib/api";

const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 4000;

async function getPublic<T>(path: string): Promise<T | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok ? ((await response.json()) as T) : undefined;
  } catch {
    return undefined;
  }
}

export const publicContent = {
  programmes: () => getPublic<Programme[]>("/public/programmes"),
  teamMembers: () => getPublic<TeamMember[]>("/public/team-members"),
  jobs: () => getPublic<Job[]>("/public/jobs"),
};

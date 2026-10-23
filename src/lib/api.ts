/**
 * Client for the MSRF backend's anonymous `/public/*` endpoints (FastAPI, `/api/v1`).
 * Shapes mirror the backend's `Public*` response schemas; the API speaks camelCase.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.malabarchallengersfc.com/api/v1"
).replace(/\/+$/, "");

// Production CORS only allows the live site, so under `next dev` the browser calls the same-origin
// proxy in next.config.mjs instead. Server-side fetches don't need CORS and use the API directly.
const REQUEST_BASE_URL =
  process.env.NODE_ENV === "development" && typeof window !== "undefined" ? "/api/v1" : API_BASE_URL;

export type Programme = {
  id: string;
  slug: string;
  title: string;
  ageGroup: string;
  description: string;
  duration: string | null;
  trainingDays: string | null;
  coachLabel: string | null;
  benefits: string[];
  /** Event date ("YYYY-MM-DD"); programmes with a date appear in the home page "Upcoming" list. */
  date?: string | null;
  place?: string | null;
  kind?: string | null;
  registrationUrl?: string | null;
};

export type TeamMember = {
  id: string;
  name: string;
  designation: string;
  biography: string | null;
  photoUrl: string | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  category: string;
  isWide: boolean;
  imageUrl: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
};

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

export type Job = {
  id: string;
  title: string;
  location: string;
  description: string;
  experienceRequired: string | null;
  postedOn: string;
  closingDate: string | null;
};

export type EnquiryInput = {
  parentName: string;
  playerName?: string | null;
  phone: string;
  email?: string | null;
  programmeId?: string | null;
  message: string;
  /** Cloudflare Turnstile token; required once the backend sets TURNSTILE_SECRET_KEY. */
  captchaToken?: string | null;
};

export type PaymentSubmissionCreated = {
  submissionNumber: string;
  status: string;
};

type Message = { detail: string };

/** Error body: {"detail", "code", "errors"?: [{field, message}]} — see backend app/core/errors.py. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly fieldErrors: { field: string; message: string }[] = [],
    /** Seconds to wait before retrying, from the Retry-After header of a 429. */
    readonly retryAfter: number | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** "45 seconds", "12 minutes", "1 hour" — for rate-limit messages. */
function formatWait(seconds: number): string {
  const [n, unit] =
    seconds < 90 ? [seconds, "second"] : seconds < 5400 ? [Math.ceil(seconds / 60), "minute"] : [Math.ceil(seconds / 3600), "hour"];
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${REQUEST_BASE_URL}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      0,
      "NETWORK_ERROR",
    );
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const fieldErrors = Array.isArray(body?.errors) ? body.errors : [];
    const retryAfter = Number(response.headers.get("Retry-After")) || null;
    const message =
      response.status === 429
        ? `${body?.detail ?? "Too many attempts."}${retryAfter ? ` Please try again in ${formatWait(retryAfter)}.` : ""}`
        : body?.code === "VALIDATION_ERROR" && fieldErrors[0]?.message
          ? String(fieldErrors[0].message).replace(/^Value error, /, "")
          : (body?.detail ?? "Something went wrong. Please try again.");
    throw new ApiError(message, response.status, body?.code ?? "HTTP_ERROR", fieldErrors, retryAfter);
  }
  return body as T;
}

const postJson = <T>(path: string, data: unknown) =>
  request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// The browser sets the multipart boundary itself, so no Content-Type here.
const postForm = <T>(path: string, data: FormData) =>
  request<T>(path, { method: "POST", body: data });

export const api = {
  programmes: () => request<Programme[]>("/public/programmes"),
  teamMembers: () => request<TeamMember[]>("/public/team-members"),
  galleryCategories: () => request<string[]>("/public/gallery-categories"),
  galleryItems: (params: { page: number; pageSize: number; category?: string | undefined }) => {
    const query = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });
    if (params.category) query.set("category", params.category);
    return request<Page<GalleryItem>>(`/public/gallery-items?${query}`);
  },
  jobs: () => request<Job[]>("/public/jobs"),

  /** Multipart: fullName, mobileNumber, emailAddress, location, cv (PDF/DOC/DOCX, max 5 MB). */
  applyForJob: (jobId: string, data: FormData) =>
    postForm<Message>(`/public/jobs/${encodeURIComponent(jobId)}/applications`, data),
  createEnquiry: (data: EnquiryInput) => postJson<Message>("/public/enquiries", data),
  /** Multipart: studentName, parentMobile, paymentMethod, amount, paymentDate, handedOverTo, screenshot. */
  submitPayment: (data: FormData) =>
    postForm<PaymentSubmissionCreated>("/public/payment-submissions", data),
};

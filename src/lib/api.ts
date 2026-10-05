/**
 * Client for the MSRF backend's anonymous `/public/*` endpoints (FastAPI, `/api/v1`).
 * Shapes mirror the backend's `Public*` response schemas; the API speaks camelCase.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

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
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
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
    const message =
      response.status === 429
        ? "Too many attempts. Please try again later."
        : body?.code === "VALIDATION_ERROR" && fieldErrors[0]?.message
          ? String(fieldErrors[0].message).replace(/^Value error, /, "")
          : (body?.detail ?? "Something went wrong. Please try again.");
    throw new ApiError(message, response.status, body?.code ?? "HTTP_ERROR", fieldErrors);
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

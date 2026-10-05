"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ApiError, api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120, "Name is too long"),
  mobileNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, ""))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  emailAddress: z.string().email("Enter a valid email address"),
  location: z.string().trim().min(2, "Enter your current city/location").max(100, "Location is too long"),
});

type Errors = {
  fullName?: string | undefined;
  mobileNumber?: string | undefined;
  emailAddress?: string | undefined;
  location?: string | undefined;
  cv?: string | undefined;
};

const field =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function JobApplicationDialog({
  trigger,
  jobId,
  jobTitle,
}: {
  trigger: React.ReactNode;
  jobId: string;
  jobTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const acceptFile = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED.includes(candidate.type.toLowerCase())) {
      setErrors((e) => ({ ...e, cv: "Only PDF or DOCX files are allowed" }));
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setErrors((e) => ({ ...e, cv: "CV must be 5 MB or smaller" }));
      return;
    }
    setErrors((e) => ({ ...e, cv: undefined }));
    setFile(candidate);
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const reset = () => {
    removeFile();
    setErrors({});
    setProgress(0);
    formRef.current?.reset();
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  };

  const onSubmit = async (event: ChangeEvent<HTMLFormElement> | React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const parsed = schema.safeParse({
      fullName: String(data.get("fullName") ?? ""),
      mobileNumber: String(data.get("mobileNumber") ?? ""),
      emailAddress: String(data.get("emailAddress") ?? ""),
      location: String(data.get("location") ?? ""),
    });

    const nextErrors: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
    }
    if (!file) nextErrors.cv = "Upload your CV";
    setErrors(nextErrors);
    
    if (!parsed.success || !file) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    setProgress(15);
    try {
      const values = parsed.data;
      const body = new FormData();
      body.append("fullName", values.fullName);
      body.append("mobileNumber", values.mobileNumber);
      body.append("emailAddress", values.emailAddress);
      body.append("location", values.location);
      body.append("cv", file);
      setProgress(50);
      const result = await api.applyForJob(jobId, body);

      setProgress(100);
      toast.success("Application submitted successfully!", { description: result.detail });
      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("We couldn't submit your application", {
        description: error instanceof ApiError ? error.message : "Please check your connection and try again.",
      });
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <p className="eyebrow uppercase tracking-widest text-accent text-xs font-bold">Apply for</p>
          <DialogTitle className="font-[family-name:var(--font-display)] text-2xl">
            {jobTitle}
          </DialogTitle>
          <DialogDescription>
            Submit your details and CV below. We'll get back to you if your profile matches our requirements.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={onSubmit} className="mt-2 space-y-5" noValidate>
          <div>
            <label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Full Name*
            </label>
            <input id="fullName" name="fullName" className={field} placeholder="Your full name" />
            {errors.fullName ? <p className="mt-2 text-xs text-destructive">{errors.fullName}</p> : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="mobileNumber" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Mobile Number*
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                inputMode="tel"
                className={field}
                placeholder="10-digit mobile number"
              />
              {errors.mobileNumber ? <p className="mt-2 text-xs text-destructive">{errors.mobileNumber}</p> : null}
            </div>

            <div>
              <label htmlFor="emailAddress" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Email Address*
              </label>
              <input
                id="emailAddress"
                name="emailAddress"
                type="email"
                className={field}
                placeholder="john@example.com"
              />
              {errors.emailAddress ? <p className="mt-2 text-xs text-destructive">{errors.emailAddress}</p> : null}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Current Location / City*
            </label>
            <input id="location" name="location" className={field} placeholder="e.g. Kozhikode, Keralam" />
            {errors.location ? <p className="mt-2 text-xs text-destructive">{errors.location}</p> : null}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground block mb-2">
              Upload CV*
            </span>
            {file ? (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3 bg-surface">
                <span className="truncate text-xs text-muted-foreground font-medium">
                  {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="shrink-0 text-xs font-semibold text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`mt-2 cursor-pointer rounded-2xl border border-dashed px-6 py-9 text-center transition-all duration-300 ${
                  dragging ? "border-accent bg-accent/5 scale-[1.02]" : "border-border hover:border-accent/50 hover:bg-white/5"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">Drag &amp; drop your CV here</p>
                <p className="mt-2 text-xs text-muted-foreground">or click to browse · PDF, DOCX · max 5 MB</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
            {errors.cv ? <p className="mt-2 text-xs text-destructive">{errors.cv}</p> : null}
          </div>

          {submitting || progress > 0 ? <Progress value={progress} className="h-2 mt-4" /> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-60 hover:shadow-[0_10px_30px_-10px_var(--accent)]"
          >
            {submitting ? "Submitting Application…" : "Submit Application"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

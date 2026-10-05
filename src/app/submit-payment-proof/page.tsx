"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ApiError, api } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { PageHero } from "@/components/site/PageHero";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/jpg", "image/png"];

const schema = z.object({
  studentName: z.string().trim().min(2, "Enter the student's full name").max(120, "Name is too long"),
  parentMobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, ""))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  paymentMethod: z.enum(["UPI", "Cash"]),
  handedOverTo: z.string().trim().optional(),
  paymentDate: z.string().min(1, "Select the payment date"),
  amount: z
    .string()
    .min(1, "Enter the amount paid")
    .refine((v) => Number(v) > 0 && Number(v) <= 1000000, "Enter a valid amount"),
});

type Errors = {
  studentName?: string | undefined;
  parentMobile?: string | undefined;
  paymentMethod?: string | undefined;
  handedOverTo?: string | undefined;
  paymentDate?: string | undefined;
  amount?: string | undefined;
  screenshot?: string | undefined;
};

const field =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export default function SubmitPaymentProofPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Cash">("UPI");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const acceptFile = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED.includes(candidate.type.toLowerCase())) {
      setErrors((e) => ({ ...e, screenshot: "Only JPG, JPEG or PNG images are allowed" }));
      return;
    }
    if (candidate.size > MAX_BYTES) {
      setErrors((e) => ({ ...e, screenshot: "Image must be 5 MB or smaller" }));
      return;
    }
    setErrors((e) => ({ ...e, screenshot: undefined }));
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const reset = () => {
    removeFile();
    setErrors({});
    setProgress(0);
    setPaymentMethod("UPI");
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
      studentName: String(data.get("studentName") ?? ""),
      parentMobile: String(data.get("parentMobile") ?? ""),
      paymentMethod: paymentMethod,
      handedOverTo: String(data.get("handedOverTo") ?? ""),
      paymentDate: String(data.get("paymentDate") ?? ""),
      amount: String(data.get("amount") ?? ""),
    });

    const nextErrors: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
    }
    if (paymentMethod === "UPI" && !file) nextErrors.screenshot = "Upload your payment screenshot";
    if (paymentMethod === "Cash" && (!parsed.success || !parsed.data?.handedOverTo)) {
        if (!parsed.data?.handedOverTo) nextErrors.handedOverTo = "Enter the name of the person you handed the cash to";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (!parsed.success) return;

    setSubmitting(true);
    setProgress(15);
    try {
      const values = parsed.data;
      const body = new FormData();
      body.append("studentName", values.studentName);
      body.append("parentMobile", values.parentMobile);
      body.append("paymentMethod", values.paymentMethod);
      body.append("amount", values.amount);
      body.append("paymentDate", values.paymentDate);
      if (values.paymentMethod === "Cash" && values.handedOverTo) {
        body.append("handedOverTo", values.handedOverTo);
      }
      if (values.paymentMethod === "UPI" && file) body.append("screenshot", file);
      setProgress(50);
      const created = await api.submitPayment(body);

      setProgress(100);
      toast.success("Payment submitted successfully!", {
        description: `Reference ${created.submissionNumber}. Our team will verify your payment and update the status shortly.`,
      });
      reset();
    } catch (error) {
      console.error(error);
      toast.error("We couldn't submit your payment", {
        description: error instanceof ApiError ? error.message : "Please check your connection and try again.",
      });
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <PageHero
        eyebrow="Payment Confirmation"
        title={
          <>
            Submit <span className="text-accent">Payment Details</span>
          </>
        }
        body="Share your payment details and proof. Our academy team will verify and update your status."
        image="/payment_banner_bg.png"
        alt="Academy desk"
      />

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl sm:p-12">
          <form ref={formRef} onSubmit={onSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="studentName" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Student name*
              </label>
              <input id="studentName" name="studentName" className={field} placeholder="Full name of the player" />
              {errors.studentName ? <p className="mt-2 text-xs text-destructive">{errors.studentName}</p> : null}
            </div>

            <div>
              <label htmlFor="parentMobile" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Parent / guardian mobile*
              </label>
              <input
                id="parentMobile"
                name="parentMobile"
                type="tel"
                inputMode="tel"
                className={field}
                placeholder="10-digit mobile number"
              />
              {errors.parentMobile ? <p className="mt-2 text-xs text-destructive">{errors.parentMobile}</p> : null}
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground block mb-4">
                Payment Method*
              </span>
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="h-4 w-4 text-accent focus:ring-accent border-border bg-background"
                  />
                  <span className="text-sm font-medium text-foreground">UPI / Online Transfer</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === "Cash"}
                    onChange={() => setPaymentMethod("Cash")}
                    className="h-4 w-4 text-accent focus:ring-accent border-border bg-background"
                  />
                  <span className="text-sm font-medium text-foreground">Cash</span>
                </label>
              </div>
            </div>

            {paymentMethod === "UPI" && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Payment screenshot*
                </span>
                {preview ? (
                  <div className="mt-2 overflow-hidden rounded-2xl border border-border">
                    <img src={preview} alt="Payment screenshot preview" className="max-h-64 w-full object-contain bg-surface" />
                    <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 bg-card/50">
                      <span className="truncate text-xs text-muted-foreground font-medium">
                        {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="shrink-0 text-xs font-semibold text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
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
                    className={`mt-2 cursor-pointer rounded-2xl border border-dashed px-6 py-12 text-center transition-all duration-300 ${
                      dragging ? "border-accent bg-accent/5 scale-[1.02]" : "border-border hover:border-accent/50 hover:bg-white/5"
                    }`}
                  >
                    <p className="text-sm font-semibold text-foreground">Drag &amp; drop your screenshot</p>
                    <p className="mt-2 text-xs text-muted-foreground">or click to browse · JPG, JPEG, PNG · max 5 MB</p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />
                {errors.screenshot ? <p className="mt-2 text-xs text-destructive">{errors.screenshot}</p> : null}
              </div>
            )}

            {paymentMethod === "Cash" && (
              <div>
                <label htmlFor="handedOverTo" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Handed Over To*
                </label>
                <input id="handedOverTo" name="handedOverTo" className={field} placeholder="Name of the person who received the cash" />
                {errors.handedOverTo ? <p className="mt-2 text-xs text-destructive">{errors.handedOverTo}</p> : null}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="paymentDate" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Payment date*
                </label>
                <input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  className={field}
                />
                {errors.paymentDate ? <p className="mt-2 text-xs text-destructive">{errors.paymentDate}</p> : null}
              </div>
              <div>
                <label htmlFor="amount" className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Payment amount*
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  className={field}
                  placeholder="₹ 0.00"
                />
                {errors.amount ? <p className="mt-2 text-xs text-destructive">{errors.amount}</p> : null}
              </div>
            </div>

            {submitting || progress > 0 ? <Progress value={progress} className="h-2 mt-4" /> : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-60 hover:shadow-[0_10px_30px_-10px_var(--accent)]"
            >
              {submitting ? "Submitting…" : "Submit Payment Details"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

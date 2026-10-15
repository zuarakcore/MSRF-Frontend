"use client";


import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { Section, SectionHead } from "@/components/site/Primitives";
import { PageHero } from "@/components/site/PageHero";
import { CAPTCHA_PENDING_MESSAGE, TURNSTILE_ENABLED, Turnstile, type TurnstileHandle } from "@/components/site/Turnstile";
import { useProgrammes } from "@/hooks/use-site-content";
import { ApiError, api, type Programme } from "@/lib/api";
import { club, img } from "@/lib/site-data";

export default Contact;

function Contact({ programmes: initialProgrammes }: { programmes?: Programme[] | undefined }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programmeId, setProgrammeId] = useState("");
  const { data: programs, isPending: programmesLoading } = useProgrammes(initialProgrammes);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // "Enquire" links on programme cards pass ?programme=<id>. Read it here rather than with
  // useSearchParams so the page can still be prerendered without a Suspense boundary.
  useEffect(() => {
    const preselected = new URLSearchParams(window.location.search).get("programme");
    if (preselected) setProgrammeId(preselected);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    if (TURNSTILE_ENABLED && !captchaToken) {
      setError(CAPTCHA_PENDING_MESSAGE);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.createEnquiry({
        parentName: text("parentName"),
        playerName: text("playerName") || null,
        phone: text("phone"),
        email: text("email") || null,
        // Ignore a stale ?programme= id that is not an active programme.
        programmeId: programs?.some((p) => p.id === programmeId) ? programmeId : null,
        message: text("message"),
        captchaToken,
      });
      setSent(true);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Please try again.";
      setError(message);
      toast.error("We couldn't send your enquiry", { description: message });
    } finally {
      setSubmitting(false);
      turnstileRef.current?.reset();
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Book a <span className="text-accent">trial</span>
          </>
        }
        body="Tell us about your child's age and experience, and our academy team will get back with the next available batch."
        image={img.contactBanner}
        alt="Youth football academy training session at golden hour"
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <SectionHead eyebrow="Enquiry form" title="Tell us about the player" />
            {sent ? (
              <div className="glass mt-10 rounded-3xl p-8">
                <p className="text-lg font-semibold text-accent">Thank you — enquiry noted.</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Our academy team will contact you shortly. For anything urgent, call {club.phone}.
                </p>
              </div>
            ) : (
              <form
                className="mt-10 grid gap-5 sm:grid-cols-2"
                onSubmit={onSubmit}
              >
                <label className="text-sm">
                  <span className="text-muted-foreground">Parent / guardian name</span>
                  <input
                    name="parentName"
                    required
                    minLength={2}
                    maxLength={120}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Player name</span>
                  <input
                    name="playerName"
                    required
                    maxLength={120}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <input
                    name="phone"
                    required
                    type="tel"
                    maxLength={20}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <input
                    name="email"
                    required
                    type="email"
                    maxLength={255}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="text-muted-foreground">Programme of interest</span>
                  <select
                    name="programmeId"
                    value={programmeId}
                    onChange={(event) => setProgrammeId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  >
                    <option value="">{programmesLoading ? "Loading programmes…" : "Not sure yet"}</option>
                    {programs?.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.title} · {program.ageGroup}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="text-muted-foreground">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    maxLength={2000}
                    className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </label>
                <div className="sm:col-span-2">
                  <Turnstile
                    ref={turnstileRef}
                    className="mb-4"
                    onToken={(token) => {
                      setCaptchaToken(token);
                      if (token) setError(null);
                    }}
                  />
                  {error ? (
                    <p role="alert" className="mb-4 text-sm text-destructive">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all duration-500 hover:brightness-110 disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? "Sending…" : "Submit enquiry"}
                  </button>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal delay={140}>
            <div className="glass rounded-3xl p-8">
              <p className="eyebrow">Academy office</p>
              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <a href={`tel:${club.phoneHref}`} className="mt-1 block text-base hover:text-accent">
                    {club.phone}
                  </a>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <a href={`mailto:${club.email}`} className="mt-1 block text-base hover:text-accent">
                    {club.email}
                  </a>
                </div>
                <div>
                  <p className="text-muted-foreground">Base</p>
                  <p className="mt-1 text-base">{club.base}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Office hours</p>
                  <p className="mt-1 text-base">{club.hours}</p>
                </div>
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                <img
                  src={img.squad[2]}
                  alt="Academy gathering in Kozhikode"
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-6 py-16 md:px-10 md:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-[1240px]">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="display-lg mt-5">{title}</h2>
      {body ? <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{body}</p> : null}
    </div>
  );
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants = {
  accent:
    "bg-accent text-accent-foreground px-7 py-3.5 hover:brightness-110 hover:shadow-[0_18px_45px_-18px_var(--accent)]",
  solid: "bg-primary text-primary-foreground px-7 py-3.5 hover:opacity-90",
  ghost: "border border-border px-7 py-3.5 hover:border-accent hover:text-accent",
  glass: "glass px-7 py-3.5 hover:border-accent hover:text-accent",
} as const;

export function ActionLink({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "glass" | "accent" | "solid" | "ghost";
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
    </Link>
  );
}

export function ActionAnchor({
  href,
  children,
  variant = "ghost",
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  /** Open in a new tab (links to other sites). */
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-border pl-5">
      <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}

/** Placeholder for API-backed lists: loading, empty and error states share one look. */
export function ContentStatus({
  children,
  tone = "muted",
  onRetry,
  className = "",
}: {
  children: ReactNode;
  tone?: "muted" | "error";
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-3xl border border-dashed border-border px-6 py-12 text-center text-sm ${
        tone === "error" ? "text-destructive" : "text-muted-foreground"
      } ${className}`}
    >
      <p>{children}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function BallIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 5.4l3.4 2.5-1.3 4h-4.2l-1.3-4z" />
      <path d="M12 5.4V2.9M15.4 7.9l2.4-.8M14.1 11.9l2.6 3.4M9.9 11.9l-2.6 3.4M8.6 7.9l-2.4-.8M9.5 19.6l1.4-3.3h2.2l1.4 3.3" />
    </svg>
  );
}

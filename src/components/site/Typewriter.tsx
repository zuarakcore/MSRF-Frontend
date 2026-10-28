"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TypeSegment = { text: string; className?: string };

// Split by grapheme so Malayalam vowel signs stay attached to their letters while typing.
function graphemes(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
      (s) => s.segment,
    );
  }
  return Array.from(text);
}

/**
 * Types `segments` out one character at a time once `start` is true. The full text is laid out invisibly
 * underneath so the surrounding layout never jumps, and screen readers get the whole text straight away.
 * Pass `segments` from a stable (module-level) value.
 */
export function Typewriter({
  segments,
  start,
  speed = 35,
  onDone,
}: {
  segments: TypeSegment[];
  start: boolean;
  speed?: number;
  onDone?: () => void;
}) {
  const units = useMemo(() => segments.map((segment) => graphemes(segment.text)), [segments]);
  const total = units.reduce((sum, unit) => sum + unit.length, 0);
  const [count, setCount] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!start) return;
    if (count >= total) {
      done.current?.();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      return;
    }
    const timer = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [start, count, total, speed]);

  let left = count;
  const typed = segments.map((segment, i) => {
    const shown = Math.min(left, units[i]!.length);
    left -= shown;
    return shown ? (
      <span key={i} className={segment.className}>
        {units[i]!.slice(0, shown).join("")}
      </span>
    ) : null;
  });

  return (
    <span className="relative block">
      <span className="sr-only">{segments.map((segment) => segment.text).join("")}</span>
      <span aria-hidden="true" className="invisible">
        {segments.map((segment, i) => (
          <span key={i} className={segment.className}>
            {segment.text}
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {typed}
        {start && count < total ? (
          <span className="ml-1 inline-block h-[0.9em] w-[0.08em] animate-pulse bg-accent align-middle" />
        ) : null}
      </span>
    </span>
  );
}

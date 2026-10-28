"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Primitives";

export function PageHero({
  eyebrow,
  title,
  body,
  image,
  alt,
  imagePosition = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  image: string;
  alt: string;
  /** Which part of the photo stays in view when the banner crops it. */
  imagePosition?: "center" | "top" | "bottom";
}) {
  return (
    <section className="relative flex min-h-[72svh] items-end overflow-hidden">
      <img
        src={image}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${
          imagePosition === "top" ? "object-top" : imagePosition === "bottom" ? "object-bottom" : "object-center"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pb-16 pt-40 md:px-10 md:pb-24">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={110}>
          <h1 className="display-lg mt-6 max-w-4xl text-on-dark">{title}</h1>
        </Reveal>
        {body ? (
          <Reveal delay={210}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/70">{body}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

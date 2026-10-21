"use client";

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Reveal } from "@/components/site/Reveal";
import type { RevealPreset } from "@/components/site/Reveal";
import { PaymentSection } from "@/components/site/PaymentSection";
import { ActionLink, ContentStatus, Eyebrow, Section, SectionHead, StatBlock, BallIcon } from "@/components/site/Primitives";
import { useProgrammes, useTeamMembers } from "@/hooks/use-site-content";
import type { Programme, TeamMember } from "@/lib/api";
import {
  club,
  heroStats,
  img,
  journey,
  missionPillars,
  partnership,
  visionPillars,
} from "@/lib/site-data";

export default Home;

function Home({ programmes: initialProgrammes, team: initialTeam }: { programmes?: Programme[] | undefined; team?: TeamMember[] | undefined }) {
  const programmes = useProgrammes(initialProgrammes);
  // Programmes with a date from today on, soonest first, shown as upcoming events.
  const today = new Date().toLocaleDateString("en-CA");
  const events = (programmes.data ?? [])
    .filter((p) => p.date && p.date >= today)
    .sort((a, b) => a.date!.localeCompare(b.date!));
  const team = useTeamMembers(initialTeam);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img
          src={img.hero}
          alt="Floodlit stadium pitch at night"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/4 h-[120vh] w-[38vw] animate-[sweep_11s_ease-in-out_infinite] opacity-40 blur-3xl"
          style={{ background: "linear-gradient(to bottom, var(--accent), transparent 70%)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pb-12 pt-28 md:px-10 md:pb-24 md:pt-36">
          <Reveal>
            <div className="flex items-center gap-3">
              <BallIcon className="h-4 w-4 animate-[roll_4s_linear_infinite] text-accent" />
              <p className="eyebrow">{club.kicker}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-xl mt-6 max-w-4xl text-on-dark">
              We create <span className="text-accent">professional</span> footballers
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">
              {club.malayalam} — a world-class grassroots academy in Keralam, built to place Indian players on the
              global stage.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <ActionLink href="/programs">Join the academy</ActionLink>
              <ActionLink href="/gallery" variant="glass">
                Watch the academy
              </ActionLink>
            </div>
          </Reveal>

        </div>

        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-white/50 md:flex">
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
          <span className="block h-12 w-px overflow-hidden bg-white/20">
            <span className="block h-4 w-px animate-[float_2.6s_ease-in-out_infinite] bg-accent" />
          </span>
        </div>
      </section>

      {/* Marquee */}
      <Reveal>
        <div className="overflow-hidden border-y border-border bg-surface py-5">
        <div className="flex w-max animate-[marquee_34s_linear_infinite] gap-12 pr-12">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex shrink-0 items-center gap-12">
              {["Grassroots to professional", "Argentinos Juniors partner", "", "Keralam's football revival", "Not-for-profit, always"].map(
                (word) => (
                  <span
                    key={word}
                    className="flex items-center gap-4 whitespace-nowrap text-sm uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    <BallIcon className="h-3.5 w-3.5 text-accent" />
                    {word}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
        </div>
      </Reveal>

      {/* About preview */}
      <Section className="pitch-grid">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHead
              eyebrow="About the club"
              title={<>A not-for-profit built to change Indian football</>}
              body={`${club.foundation} is a Section 8 not-for-profit founded by retired civil servants and their associates, focused solely on promoting football in Keralam and across India. MSRF owns and operates ${club.short}.`}
            />
            <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
              <ActionLink href="/about" variant="ghost">
                Our story
              </ActionLink>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {missionPillars.slice(0, 4).map((pillar, index) => {
              const presets: ("up" | "scale" | "left" | "blur")[] = ["up", "scale", "left", "blur"];
              return (
                <Reveal key={pillar.title} delay={index * 90} preset={presets[index % presets.length] as RevealPreset}>
                  <article className="glass lift h-full rounded-3xl p-7">
                    <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.2em] text-accent">
                      0{index + 1}
                    </p>
                    <h3 className="mt-4 text-lg">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Vision */}
      <Section className="bg-surface">
        <Reveal>
          <SectionHead
            eyebrow="Our vision"
            title="Four commitments that shape every session"
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {visionPillars.map((pillar, index) => {
            const presets: ("down" | "right" | "up" | "blur")[] = ["down", "right", "up", "blur"];
            return (
              <Reveal key={pillar.title} delay={index * 90} preset={presets[index % presets.length] as RevealPreset}>
                <article className="lift group h-full overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <h3 className="absolute bottom-4 left-5 text-xl uppercase text-on-dark">{pillar.title}</h3>
                  </div>
                  <p className="p-6 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Programmes preview */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              eyebrow="Training programmes"
              title="Pathways from first touch to professional"
            />
          </Reveal>
          <Reveal delay={120}>
            <ActionLink href="/programs" variant="ghost">
              All programmes
            </ActionLink>
          </Reveal>
        </div>
        {programmes.isPending ? (
          <ContentStatus className="mt-14">Loading programmes…</ContentStatus>
        ) : programmes.isError ? (
          <ContentStatus tone="error" className="mt-14" onRetry={() => programmes.refetch()}>
            We couldn&apos;t load the programmes right now.
          </ContentStatus>
        ) : null}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {programmes.data?.slice(0, 3).map((program, index) => (
            <Reveal key={program.id} delay={index * 100}>
              <article className="glass lift flex h-full flex-col rounded-3xl p-8">
                <Eyebrow>{program.ageGroup}</Eyebrow>
                <h3 className="mt-4 text-2xl">{program.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{program.description}</p>
                <Link
                  href={`/contact?programme=${program.id}`}
                  className="mt-auto pt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent"
                >
                  Enquiry <span aria-hidden>→</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Technical Partner */}
      <section className="relative bg-surface px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="group relative overflow-hidden rounded-[3rem] bg-card border border-border shadow-2xl">
            {/* Background Image with Overlay */}
            <img
              src={img.ajVisit}
              alt="Technical Partner delegation with academy players"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/20" />

            <div className="relative grid items-center gap-8 p-8 md:gap-12 md:p-12 lg:grid-cols-[1.5fr_1fr] lg:p-20">
              {/* Text Content */}
              <Reveal>
                <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur-sm border border-white/10 mb-8">
                  <BallIcon className="h-4 w-4 text-accent" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white">
                    {partnership.nickname}
                  </span>
                </div>
                
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-black tracking-tight text-white uppercase sm:text-3xl md:text-5xl">
                  Technical Partner
                </h2>
                
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
                  {partnership.body}
                </p>
                
                <div className="mt-8 md:mt-12">
                  <ActionLink href="/partner" variant="accent">
                    Inside the partnership
                  </ActionLink>
                </div>
              </Reveal>

              {/* Logo Area */}
              <Reveal delay={150}>
                <div className="flex flex-col items-center lg:items-end justify-center">
                  <div className="relative flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-700 group-hover:bg-white/10">
                    <img
                      src={img.argentinosCrest}
                      alt="Technical Partner crest"
                      loading="lazy"
                      className="h-48 sm:h-64 w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-8 text-center lg:text-right text-xs font-bold uppercase tracking-[0.25em] text-accent">
                    Buenos Aires · {partnership.country}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <Section className="bg-surface">
        <Reveal>
          <SectionHead
            eyebrow="The dream, transformed into reality"
            title="Three steps from a village pitch to the India jersey"
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-3">
          {journey.map((item, index) => (
            <Reveal key={item.step} delay={index * 120}>
              <article className="group text-center">
                <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-full border border-border">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    // The photos are pre-cut circles on white; a slight zoom keeps the white corners out of view.
                    className="h-full w-full scale-[1.08] object-cover transition-transform duration-[1200ms] group-hover:scale-[1.16]"
                  />
                </div>
                <p className="mt-8 font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.2em] text-accent">
                  {item.step}
                </p>
                <h3 className="mt-3 text-xl">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Events */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead eyebrow="Upcoming" title="Camps, trials and Argentina visits" />
          </Reveal>
        </div>
        {programmes.isPending ? (
          <ContentStatus className="mt-14">Loading upcoming events…</ContentStatus>
        ) : programmes.isError ? (
          <ContentStatus tone="error" className="mt-14" onRetry={() => programmes.refetch()}>
            We couldn&apos;t load the upcoming events right now.
          </ContentStatus>
        ) : events.length === 0 ? (
          <Reveal>
            <div className="glass relative mt-14 overflow-hidden rounded-[2rem] px-8 py-12 text-center md:px-14 md:py-16">
              <div
                className="pointer-events-none absolute -top-1/2 left-1/2 h-[40vh] w-[40vw] -translate-x-1/2 opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }}
              />
              <div className="relative mx-auto flex max-w-xl flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
                  </svg>
                </span>
                <h3 className="mt-6 text-2xl md:text-3xl">No upcoming events as of now</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  New camps, trials and Argentina visits will be announced here soon. Get in touch to hear about the
                  next one first.
                </p>
                <div className="mt-8">
                  <ActionLink href="/contact" variant="ghost">
                    Contact us
                  </ActionLink>
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}
        <div className={`mt-14 divide-y divide-border border-y border-border ${events.length === 0 ? "hidden" : ""}`}>
          {events.map((event, index) => (
            <Reveal key={event.id} delay={index * 90}>
              <Link
                href={`/contact?programme=${event.id}`}
                className="group flex flex-wrap items-center justify-between gap-6 py-8 transition-colors hover:bg-surface"
              >
                <div className="flex items-center gap-8">
                  <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.2em] text-accent">
                    {new Date(`${event.date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </span>
                  <div>
                    <h3 className="text-xl">{event.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[event.kind ?? event.ageGroup, event.place].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent">
                  Register →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Leadership preview */}
      <Section className="bg-surface">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              eyebrow="Governance"
              title="Led by people who have run states"
              body="Retired civil servants, diplomats and an India captain — governing the academy with the standards they brought to public service."
            />
          </Reveal>
          <Reveal delay={120}>
            <ActionLink href="/about" variant="ghost">
              Meet the board
            </ActionLink>
          </Reveal>
        </div>
        {team.isPending ? (
          <ContentStatus className="mt-14">Loading the board…</ContentStatus>
        ) : team.isError ? (
          <ContentStatus tone="error" className="mt-14" onRetry={() => team.refetch()}>
            We couldn&apos;t load the board right now.
          </ContentStatus>
        ) : null}
        {team.data?.length ? (
        <Reveal delay={240}>
          <div className="mt-14">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            // Swiper's loop mode needs more slides than are visible at once.
            loop={team.data.length > 4}
          >
            {team.data.map((member) => (
              <SwiperSlide key={member.id}>
                <article className="lift group overflow-hidden rounded-3xl border border-border bg-card">
                  <div className="aspect-[3/4] overflow-hidden flex items-center justify-center bg-muted">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-8xl font-bold text-muted-foreground/30 uppercase">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="eyebrow">{member.designation}</p>
                    <h3 className="mt-3 text-base">{member.name}</h3>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
        </Reveal>
        ) : null}
      </Section>

      {/* Payment confirmation */}
      <PaymentSection />

      {/* CTA */}
      <Section>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2.5rem] px-8 py-12 text-center md:px-16 md:py-20">
            <div
              className="pointer-events-none absolute -top-1/2 left-1/2 h-[60vh] w-[60vw] -translate-x-1/2 animate-[sweep_12s_ease-in-out_infinite] opacity-30 blur-3xl"
              style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }}
            />
            <div className="relative">
              <Eyebrow>Admissions open</Eyebrow>
              <h2 className="display-lg mx-auto mt-6 max-w-3xl">Bring your child to the trials</h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                Speak to our academy team about age groups, batches and the professional pathway.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10">
                <ActionLink href="/contact">Book a trial</ActionLink>
                <a
                  href={`tel:${club.phoneHref}`}
                  className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                >
                  {club.phone}
                </a>
              </div>

            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

"use client";


import { Reveal } from "@/components/site/Reveal";
import { ActionLink, ContentStatus, Section, SectionHead, StatBlock } from "@/components/site/Primitives";
import { PageHero } from "@/components/site/PageHero";
import { useTeamMembers } from "@/hooks/use-site-content";
import { club, img, missionPillars, roadmap, trustPoints, visionPillars } from "@/lib/site-data";

export default About;

function About() {
  const { data: team, isPending: teamLoading, isError: teamError, refetch: refetchTeam } = useTeamMembers();

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Football, run with the <span className="text-accent">discipline of public service</span>
          </>
        }
        body={`${club.foundation} is a not-for-profit company registered under Section 8 of the Companies Act, founded by a group of retired civil servants and their associates with a single aim — promoting football in Keralam and India.`}
        image="/about_banner_bg.png"
        alt="Epic football stadium background"
      />

      <Section className="pitch-grid">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <SectionHead
              eyebrow="Who we are"
              title="Owned by a foundation, driven by shareholders"
              body="MSRF owns and operates Malabar Challengers Football Club. Because we are not-for-profit, every rupee raised returns to coaching, facilities, nutrition and welfare for the children in our care."
            />
            <ul className="mt-10 space-y-4">
              {trustPoints.map((point) => (
                <li key={point} className="flex gap-4  pb-4 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140} className="h-full min-h-[400px]">
            <div className="h-full w-full overflow-hidden rounded-[2rem] border border-border shadow-2xl">
              <img
                src="/about_training_bg.png"
                alt="Young players training at the academy"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-surface">
        <Reveal>
          <SectionHead eyebrow="Our mission" title="Four things we promise every family" align="center" />
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {missionPillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 90}>
              <article className="glass lift h-full rounded-3xl p-8">
                <p className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Mission 0{index + 1}
                </p>
                <h3 className="mt-4 text-xl">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <SectionHead eyebrow="Our vision" title="Where we intend to take Indian football" />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visionPillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 80}>
              <article className="h-full rounded-3xl border border-border bg-card p-7">
                <h3 className="text-lg uppercase text-accent">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <Reveal>
          <SectionHead
            eyebrow="Implementation plan"
            title="2024 → 2029, step by step"
            body="A phased plan that begins with coaches, builds through youth development and ends with a professional team in the National League."
          />
        </Reveal>
        <div className="relative mt-16">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-1/2" />
          <div className="space-y-10">
            {roadmap.map((item, index) => (
              <Reveal key={item.title} delay={index * 100}>
                <div
                  className={`relative pl-10 md:w-1/2 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-2 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background md:left-auto ${
                      index % 2 === 0 ? "md:-right-[7px]" : "md:-left-[7px]"
                    }`}
                  />
                  <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.2em] text-accent">
                    {item.year}
                  </p>
                  <h3 className="mt-3 text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <Reveal>
          <SectionHead
            eyebrow="Our team"
            title={
              <>
                Governed by people who <span className="text-accent">built institutions</span>
              </>
            }
            body="Malabar Sports & Recreation Foundation is directed by retired civil servants, a former ambassador and industry leaders."
            align="center"
          />
        </Reveal>
        {teamLoading ? (
          <ContentStatus className="mt-16">Loading the board…</ContentStatus>
        ) : teamError ? (
          <ContentStatus tone="error" className="mt-16" onRetry={() => refetchTeam()}>
            We couldn&apos;t load the team right now.
          </ContentStatus>
        ) : null}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team?.map((member, index) => (
            <Reveal key={member.id} delay={(index % 3) * 90}>
              <article className="lift group h-full overflow-hidden rounded-3xl border border-border bg-card">
                <div className="h-48 w-full overflow-hidden flex items-center justify-center bg-muted transition-transform duration-700 group-hover:scale-105">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-8xl font-bold text-muted-foreground/30 uppercase">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="p-7">
                  <p className="eyebrow">{member.designation}</p>
                  <h2 className="mt-3 text-lg">{member.name}</h2>
                  {member.biography ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.biography}</p>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[3rem] px-8 py-24 text-center md:px-14 shadow-2xl border border-white/10">
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative mx-auto max-w-3xl flex flex-col items-center">
              <span className="mb-6 inline-block rounded-full bg-accent/10 px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-accent ring-1 ring-accent/30">
                Join the club
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                Be part of the <br />
                <span className="text-accent">next generation</span>
              </h2>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground/90 max-w-2xl leading-relaxed">
                Whether you are a parent, a coach or a partner, there is a place for you in this project. Help us build a professional football culture in India.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                <ActionLink href="/contact" className="w-full sm:w-auto min-w-[180px] shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                  Talk to us
                </ActionLink>
                <ActionLink href="/programs" variant="glass" className="w-full sm:w-auto min-w-[180px]">
                  See programmes
                </ActionLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

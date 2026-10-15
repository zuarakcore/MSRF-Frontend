"use client";


import { Reveal } from "@/components/site/Reveal";
import { ActionAnchor, ActionLink, ContentStatus, Section, SectionHead } from "@/components/site/Primitives";
import { PageHero } from "@/components/site/PageHero";
import { useProgrammes } from "@/hooks/use-site-content";
import type { Programme } from "@/lib/api";
import { img } from "@/lib/site-data";

export default Programs;

function Programs({ programmes: initialProgrammes }: { programmes?: Programme[] | undefined }) {
  const { data: programs, isPending, isError, refetch } = useProgrammes(initialProgrammes);

  return (
    <>
      <PageHero
        eyebrow="Training programmes"
        title={
          <>
            Every age group has a <span className="text-accent">clear pathway</span>
          </>
        }
        body="From a first controlled touch at six to a professional trial at eighteen — structured blocks, accredited coaches and measurable progress at every stage."
        image="/programs_banner.webp"
        alt="Academy training session in progress"
      />

      <Section>
        {isPending ? (
          <ContentStatus>Loading programmes…</ContentStatus>
        ) : isError ? (
          <ContentStatus tone="error" onRetry={() => refetch()}>
            We couldn&apos;t load the programmes right now.
          </ContentStatus>
        ) : !programs?.length ? (
          <ContentStatus>New programmes will be announced soon.</ContentStatus>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {programs?.map((program, index) => (
            <Reveal key={program.id} delay={(index % 3) * 90}>
              <article className="glass lift flex h-full flex-col rounded-3xl p-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="eyebrow">{program.ageGroup}</p>
                </div>
                <h2 className="mt-5 text-2xl">{program.title}</h2>
                <p className="mt-4 text-sm text-muted-foreground">{program.description}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-9">
                  {/* The API only accepts https:// links and site paths, so the URL is safe to render. */}
                  {program.registrationUrl ? (
                    <ActionAnchor href={program.registrationUrl} variant="accent" external={program.registrationUrl.startsWith("https://")}>
                      Register
                    </ActionAnchor>
                  ) : null}
                  <ActionLink href={`/contact?programme=${program.id}`} variant="ghost">
                    Enquire
                  </ActionLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHead
              eyebrow="How a season works"
              title="Coaching blocks, not casual practice"
              body="Each programme runs in periodised blocks with technical, tactical, physical and psychological objectives. Parents receive a written review at the end of every block."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Block 1 · Foundation", body: "Ball mastery, coordination and habit-building." },
                { title: "Block 2 · Application", body: "Small-sided games and position-specific work." },
                { title: "Block 3 · Competition", body: "Fixtures, video analysis and load management." },
                { title: "Block 4 · Review", body: "Testing, written reports and pathway decisions." },
              ].map((block) => (
                <div key={block.title} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-accent">{block.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{block.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="overflow-hidden rounded-[2rem] border border-border">
              <img
                src={img.training[2]}
                alt="Coach instructing academy players"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

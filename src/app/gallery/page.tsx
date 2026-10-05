"use client";


import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { ContentStatus, Section } from "@/components/site/Primitives";
import { PageHero } from "@/components/site/PageHero";
import { useGalleryCategories, useGalleryItems } from "@/hooks/use-site-content";
import type { GalleryItem } from "@/lib/api";

const ALL = "All";

// The 600px thumbnail covers grid cells on most screens; the full image serves high-DPI ones.
function srcSet(item: GalleryItem) {
  if (!item.thumbnailUrl || !item.width) return undefined;
  return `${item.thumbnailUrl} 600w, ${item.imageUrl} ${item.width}w`;
}

export default Gallery;

function Gallery() {
  const [active, setActive] = useState<string>(ALL);
  const { data: categories } = useGalleryCategories();
  const gallery = useGalleryItems(active === ALL ? undefined : active);
  const items = gallery.data?.pages.flatMap((page) => page.items) ?? [];
  const galleryCategories = [ALL, ...(categories ?? [])];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Inside the <span className="text-accent">academy</span>
          </>
        }
        body="Training sessions, match days, academy events and moments from our Argentine partnership."
        image="/gallery_banner_bg.png"
        alt="Academy players celebrating on the pitch at sunset, with photo prints and a camera"
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-500 ${
                active === category
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {gallery.isPending ? (
          <ContentStatus className="mt-12">Loading photos…</ContentStatus>
        ) : gallery.isError && items.length === 0 ? (
          <ContentStatus tone="error" className="mt-12" onRetry={() => gallery.refetch()}>
            We couldn&apos;t load the gallery right now.
          </ContentStatus>
        ) : items.length === 0 ? (
          <ContentStatus className="mt-12">No photos here yet.</ContentStatus>
        ) : null}

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={(index % 3) * 80}>
              <figure className="lift group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border">
                <img
                  src={item.imageUrl}
                  srcSet={srcSet(item)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  alt={item.caption ?? item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute bottom-0 left-0 right-0 translate-y-3 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-accent">{item.category}</p>
                  <p className="mt-2 text-sm font-medium text-on-dark">{item.caption ?? item.title}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {gallery.hasNextPage ? (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => gallery.fetchNextPage()}
              disabled={gallery.isFetchingNextPage}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-500 hover:border-accent hover:text-accent disabled:opacity-60"
            >
              {gallery.isFetchingNextPage ? "Loading…" : "Load more"}
            </button>
          </div>
        ) : null}
      </Section>
    </>
  );
}

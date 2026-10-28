"use client";

import { useCallback, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ContentStatus, Section } from "@/components/site/Primitives";
import { img } from "@/lib/site-data";
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
  // Index into `items` of the photo open in the preview, or null when it is closed.
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

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
        image={img.galleryBanner}
        alt="Young players in blue and yellow kits competing in a match on a grass pitch"
        imagePosition="bottom"
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          {galleryCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setPreviewIndex(null);
              }}
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
                <button
                  type="button"
                  onClick={() => setPreviewIndex(index)}
                  aria-label={`Open preview: ${item.title}`}
                  className="absolute inset-0 z-10 cursor-zoom-in rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
                <img
                  src={item.imageUrl}
                  srcSet={srcSet(item)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute bottom-0 left-0 right-0 translate-y-3 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                    {item.category}
                  </p>
                  <p className="mt-2 text-sm font-medium text-on-dark">
                    {item.title}
                  </p>
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

      <GalleryPreview
        items={items}
        index={previewIndex}
        onIndexChange={setPreviewIndex}
        hasMore={Boolean(gallery.hasNextPage)}
        onLoadMore={() => gallery.fetchNextPage()}
      />
    </>
  );
}

/** Full-size photo preview with previous/next (buttons, arrow keys) and Esc / backdrop to close. */
function GalleryPreview({
  items,
  index,
  onIndexChange,
  hasMore,
  onLoadMore,
}: {
  items: GalleryItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const item = index === null ? undefined : items[index];
  const canPrev = index !== null && index > 0;
  const canNext = index !== null && (index < items.length - 1 || hasMore);

  const go = useCallback(
    (step: -1 | 1) => {
      if (index === null) return;
      const next = index + step;
      if (next < 0) return;
      if (next >= items.length) {
        // The next photo is on a page not loaded yet: load it, then Next moves on.
        if (hasMore) onLoadMore();
        return;
      }
      onIndexChange(next);
    },
    [index, items.length, hasMore, onLoadMore, onIndexChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const navButton =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/80 disabled:pointer-events-none disabled:opacity-30";

  return (
    <DialogPrimitive.Root
      open={Boolean(item)}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none sm:p-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) onIndexChange(null);
          }}
        >
          {item ? (
            <>
              <DialogPrimitive.Title className="sr-only">
                {item.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Photo {(index ?? 0) + 1} of {items.length}. Use the arrow keys for the previous or
                next photo.
              </DialogPrimitive.Description>

              <DialogPrimitive.Close
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/80"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>

              <button
                type="button"
                onClick={() => go(-1)}
                disabled={!canPrev}
                aria-label="Previous photo"
                className={`${navButton} left-3 sm:left-6`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={!canNext}
                aria-label="Next photo"
                className={`${navButton} right-3 sm:right-6`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <img
                key={item.id}
                src={item.imageUrl}
                alt={item.title}
                className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <div className="mt-4 max-w-2xl text-center">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-accent">
                  {item.category}
                </p>
                <p className="mt-1 text-sm font-medium text-on-dark">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  {(index ?? 0) + 1} / {items.length}
                  {hasMore ? "+" : ""}
                </p>
              </div>
            </>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Public content changes rarely; avoid refetching on every mount and focus.
const STALE_TIME = 5 * 60 * 1000;

export const GALLERY_PAGE_SIZE = 24;

export function useProgrammes() {
  return useQuery({
    queryKey: ["public", "programmes"],
    queryFn: api.programmes,
    staleTime: STALE_TIME,
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["public", "team-members"],
    queryFn: api.teamMembers,
    staleTime: STALE_TIME,
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ["public", "gallery-categories"],
    queryFn: api.galleryCategories,
    staleTime: STALE_TIME,
  });
}

/** `category` undefined means all categories. */
export function useGalleryItems(category?: string) {
  return useInfiniteQuery({
    queryKey: ["public", "gallery-items", category ?? null],
    queryFn: ({ pageParam }) =>
      api.galleryItems({ page: pageParam, pageSize: GALLERY_PAGE_SIZE, category }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
  });
}

export function useJobs() {
  return useQuery({ queryKey: ["public", "jobs"], queryFn: api.jobs, staleTime: STALE_TIME });
}

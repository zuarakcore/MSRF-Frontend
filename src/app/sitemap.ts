import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Public pages only; staff screens (/auth, /admin) are left out and marked noindex.
const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] =
  [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/programs", priority: 0.9, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/career", priority: 0.6, changeFrequency: "daily" },
    { path: "/gallery", priority: 0.6, changeFrequency: "weekly" },
    { path: "/partner", priority: 0.5, changeFrequency: "monthly" },
    { path: "/submit-payment-proof", priority: 0.3, changeFrequency: "monthly" },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  }));
}

import type { Metadata } from "next";
import Gallery from "./GalleryPage";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Malabar Challengers FC training sessions, matches and academy events.",
  alternates: { canonical: "/gallery" },
};

export default function Page() {
  return <Gallery />;
}

import type { Metadata } from "next";
import { connection } from "next/server";
import { publicContent } from "@/lib/api-server";
import Contact from "./ContactPage";

export const metadata: Metadata = {
  title: "Book a Trial",
  description:
    "Book a trial or ask about admissions at Malabar Challengers FC. Tell us your child's age and experience and our academy team will be in touch.",
  alternates: { canonical: "/contact" },
};

export default async function Page() {
  await connection();
  return <Contact programmes={await publicContent.programmes()} />;
}

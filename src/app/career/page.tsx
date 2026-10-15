import type { Metadata } from "next";
import { connection } from "next/server";
import { publicContent } from "@/lib/api-server";
import CareerPage from "./CareerPage";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Open coaching and staff positions at Malabar Challengers Football Club. Apply online with your CV.",
  alternates: { canonical: "/career" },
};

export default async function Page() {
  await connection();
  return <CareerPage jobs={await publicContent.jobs()} />;
}

import type { Metadata } from "next";
import { connection } from "next/server";
import { publicContent } from "@/lib/api-server";
import About from "./AboutPage";

export const metadata: Metadata = {
  title: "About the Club",
  description:
    "The vision, mission and leadership of Malabar Challengers Football Club and the Malabar Sports & Recreation Foundation.",
  alternates: { canonical: "/about" },
};

export default async function Page() {
  await connection();
  return <About team={await publicContent.teamMembers()} />;
}

import type { Metadata } from "next";
import { connection } from "next/server";
import { publicContent } from "@/lib/api-server";
import Programs from "./ProgramsPage";

export const metadata: Metadata = {
  title: "Training Programmes",
  description:
    "Football training programmes for every age group at Malabar Challengers FC, from grassroots kids to professional trials.",
  alternates: { canonical: "/programs" },
};

export default async function Page() {
  await connection();
  return <Programs programmes={await publicContent.programmes()} />;
}

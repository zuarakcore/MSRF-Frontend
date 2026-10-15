import type { Metadata } from "next";
import { connection } from "next/server";
import { publicContent } from "@/lib/api-server";
import Home from "./HomePage";

export const metadata: Metadata = {
  title: { absolute: "Malabar Challengers Football Club | Youth Football Academy in Kozhikode" },
  description:
    "Malabar Challengers FC develops professional footballers in Keralam: age-group training programmes, accredited coaches and a partnership with Argentinos Juniors.",
  alternates: { canonical: "/" },
};

export default async function Page() {
  // Render per request so programmes and team come from the API's 60-second cache, not the build.
  await connection();
  const [programmes, team] = await Promise.all([
    publicContent.programmes(),
    publicContent.teamMembers(),
  ]);
  return <Home programmes={programmes} team={team} />;
}

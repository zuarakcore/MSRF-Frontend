import type { Metadata } from "next";
import Partner from "./PartnerPage";

export const metadata: Metadata = {
  title: "Argentinos Juniors Partnership",
  description:
    "How Malabar Challengers FC works with Argentinos Juniors, the Argentine club known as the World's Football Nursery.",
  alternates: { canonical: "/partner" },
};

export default function Page() {
  return <Partner />;
}

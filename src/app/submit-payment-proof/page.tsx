import type { Metadata } from "next";
import SubmitPaymentProofPage from "./SubmitPaymentProofPage";

export const metadata: Metadata = {
  title: "Submit Fee Payment",
  description:
    "Parents: send your Malabar Challengers FC fee payment details and UPI screenshot so the academy can verify it.",
  alternates: { canonical: "/submit-payment-proof" },
};

export default function Page() {
  return <SubmitPaymentProofPage />;
}

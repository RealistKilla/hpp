import React from "react";
import { getQuoteSummary } from "../../services/getQuoteSummary";
import PayQuoteCard from "../../components/PayQuoteCard";
import { redirect } from "next/navigation";

type PageQuotePageProps = {
  params: Promise<{ uuid: string }>;
};

const PayPage = async ({ params }: PageQuotePageProps) => {
  const { uuid } = await params;

  const quote = await getQuoteSummary(uuid, true);

  if (quote.quoteStatus === "EXPIRED") {
    return redirect(`/payin/${uuid}/pay`);
  }

  return <PayQuoteCard quote={quote} />;
};

export default PayPage;

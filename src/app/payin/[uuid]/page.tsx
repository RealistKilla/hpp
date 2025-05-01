import AcceptQuoteCard from "../components/AcceptQuoteCard";
import { getQuoteSummary } from "../services/getQuoteSummary";
import { redirect } from "next/navigation";

type AcceptQuotePageProps = {
  params: Promise<{ uuid: string }>;
};

export const dynamic = "force-dynamic";

const AcceptQuotePage = async ({ params }: AcceptQuotePageProps) => {
  const { uuid } = await params;
  const quote = await getQuoteSummary(uuid, true);

  // redirect to expired page if quote is expired

  if (quote.quoteStatus === "ACCEPTED") {
    return redirect(`/payin/${uuid}/pay`);
  }

  if (quote.status === "EXPIRED") {
    return redirect(`/payin/${uuid}/expired`);
  }

  return <AcceptQuoteCard quote={quote} />;
};

export default AcceptQuotePage;

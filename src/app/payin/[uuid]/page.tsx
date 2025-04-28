import AcceptQuoteCard from "../components/AcceptQuoteCard";
import { getQuoteSummary } from "../services/getQuoteSummary";
import { redirect } from "next/navigation";

type AcceptQuotePageProps = {
  params: Promise<{ uuid: string }>;
};

const AcceptQuotePage = async ({ params }: AcceptQuotePageProps) => {
  const { uuid } = await params;
  const quote = await getQuoteSummary(uuid, true);

  // redirect to expired page if quote is expired
  if (quote.status === "EXPIRED") {
    return redirect(`/payin/${uuid}/expired`);
  } else if (quote.quoteStatus === "ACCEPTED") {
    return redirect(`/payin/${uuid}/pay`);
  }

  return (
    <div>
      <h1>Accept Quote Page</h1>
      <AcceptQuoteCard quote={quote} />
    </div>
  );
};

export default AcceptQuotePage;

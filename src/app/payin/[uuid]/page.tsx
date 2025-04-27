import AcceptQuoteCard from "../components/AcceptQuoteCard";
import { getQuoteSummary } from "../services/getQuoteSummary";

type AcceptQuotePageProps = {
  params: Promise<{ uuid: string }>;
};

const AcceptQuotePage = async ({ params }: AcceptQuotePageProps) => {
  const { uuid } = await params;
  const quote = await getQuoteSummary(uuid, true);

  // handle error from axios call
  if (!quote) {
    return <div>Something went wrong, please try again</div>;
  }

  return (
    <div>
      <h1>Accept Quote Page</h1>
      <AcceptQuoteCard quote={quote} />
    </div>
  );
};

export default AcceptQuotePage;

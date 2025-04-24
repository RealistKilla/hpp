import api from "@/app/util/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import AcceptQuoteCard from "./components/AcceptQuoteCard";

type AcceptQuotePageProps = {
  params: Promise<{ uuid: string }>;
};

const getQuote = async (uuid: string) => {
  console.log("this is the uuid", uuid);
  const safeUUID = encodeURIComponent(uuid);
  try {
    const response = await axios.get(
      `https://api.sandbox.bvnk.com/api/v1/pay/${safeUUID}/summary`
    );

    return response.data;
  } catch (error: any) {
    console.log("this is the error", error);
    return null;
  }
};

const AcceptQuotePage = async ({ params }: AcceptQuotePageProps) => {
  const { uuid } = await params;
  const quote = await getQuote(uuid);

  if (!quote) {
    return <div>Something went wrong, please try again</div>;
  }

  console.log("this is the quote??", quote);
  return (
    <div>
      <h1>Accept Quote Page</h1>
      <AcceptQuoteCard quote={quote} />
    </div>
  );
};

export default AcceptQuotePage;

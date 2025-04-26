"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover } from "@/components/ui/popover";
import { useParams } from "next/navigation";
import { isCurrencySelectOpenAtom, useQuote } from "../atoms/quote";
import { useAtom } from "jotai";

type Quote = {
  merchantDisplayName: string;
  displayCurrency: {
    amount: string;
    currency: string;
  };
  reference: string;
};
type AcceptQuoteCardProps = {
  quote: Quote;
};
const AcceptQuoteCard: React.FC<AcceptQuoteCardProps> = ({ quote }) => {
  const { uuid }: { uuid: string } = useParams();

  // pass server quote to jotai atom
  const quoteData = useQuote(uuid, quote);

  const [isCurrencySelectOpen, setIsCurrencySelectOpen] = useAtom(
    isCurrencySelectOpenAtom
  );

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col items-center">
            <h2>{quoteData?.data?.merchantDisplayName}</h2>
            <h2 className="text-3xl">
              {quoteData?.data?.displayCurrency.amount}
              <span className="text-lg pl-1">
                {quoteData?.data?.displayCurrency.currency}
              </span>
            </h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p>For reference number: {quoteData?.data?.reference}</p>
          </div>
        </div>
        <Popover open={isCurrencySelectOpen}></Popover>
      </CardContent>
    </Card>
  );
};

export default AcceptQuoteCard;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col items-center">
            <h2>{quote.merchantDisplayName}</h2>
            <h2 className="text-3xl">
              {quote.displayCurrency.amount}
              <span className="text-lg pl-1">
                {quote.displayCurrency.currency}
              </span>
            </h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p>For reference number: {quote.reference}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcceptQuoteCard;

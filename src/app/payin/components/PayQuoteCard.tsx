"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import { useQuoteQuery } from "../atoms/quote";
import { CurrencyName, Quote } from "../lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { truncateMiddle } from "../lib/truncateMiddle";
import CopyText from "@/components/CopyText";
import QRCode from "react-qr-code";
import { CountdownTimer } from "@/components/CountdownTimer";

type PayQuoteCardProps = {
  quote: Quote;
};

const PayQuoteCard: React.FC<PayQuoteCardProps> = ({ quote: initialQuote }) => {
  const { uuid }: { uuid: string } = useParams();
  const quote = useQuoteQuery(uuid, initialQuote);
  const router = useRouter();

  // get the full currency name from the currency enum
  const fullCurrencyName =
    CurrencyName[
      quote.data?.paidCurrency.currency as keyof typeof CurrencyName
    ];
  const currencyName = quote.data?.paidCurrency.currency;
  const truncatedAddress = truncateMiddle(quote.data?.address.address!, 15);

  const onQuoteExpire = async () => {
    // doing it like this because the quote value is not updated when we want to use it for comparison here.
    const newQuote = await quote.refetch();

    newQuote.data?.status === "EXPIRED" && router.replace(`expired`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Pay with {fullCurrencyName}</h1>
        </CardTitle>
        <p className="text-gray">
          To complete this payment send the amount due to the {currencyName}{" "}
          address provided below.
        </p>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex flex-col items-center">
          <p className="text-gray">Amount due</p>
          <div className="flex gap-x-1">
            <p>
              {quote.data?.paidCurrency.amount} {currencyName}
            </p>
            <CopyText text={quote.data?.paidCurrency.amount!} />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col items-center">
          <p className="text-gray">{currencyName} Address</p>
          <div className="flex gap-x-1">
            <p>{truncatedAddress}</p>
            <CopyText text={quote.data?.address.address!} />
          </div>
        </div>
        <div>
          <QRCode
            data-testid="qr-code"
            value={quote.data?.address.uri!}
            size={200}
          />
          <p>{quote.data?.address.address}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-x-1">
          <p>Time left to pay</p>
          <CountdownTimer
            targetTimeMs={quote.data?.quoteExpiryDate!}
            onExpire={onQuoteExpire}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PayQuoteCard;

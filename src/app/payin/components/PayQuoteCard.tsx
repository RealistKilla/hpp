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
import { truncateMiddle } from "../lib/truncateMiddle";
import CopyText from "@/components/CopyText";
import QRCode from "react-qr-code";
import { CountdownTimer } from "@/components/CountdownTimer";
import Separator from "@/components/ui/Separator";

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

    newQuote.data?.status === "EXPIRED" && router.push(`expired`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-6 flex items-center text-center">
          <h1>Pay with {fullCurrencyName}</h1>
        </CardTitle>
        <p className="text-gray max-w-[320px] text-center">
          To complete this payment send the amount due to the {currencyName}{" "}
          address provided below.
        </p>
      </CardHeader>
      <CardContent className="w-full">
        <Separator className="my-2" />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray">Amount due</p>
          <div className="flex gap-x-1">
            <p className="font-semibold">
              {quote.data?.paidCurrency.amount} {currencyName}
            </p>
            <CopyText text={quote.data?.paidCurrency.amount!} />
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray">{currencyName} Address</p>
          <div className="flex gap-x-1">
            <p className="font-semibold">{truncatedAddress}</p>
            <CopyText text={quote.data?.address.address!} />
          </div>
        </div>
        <div className="grid place-items-center gap-y-2 py-8">
          <QRCode
            size={160}
            className="w-full max-w-[160px] h-auto"
            data-testid="qr-code"
            value={quote.data?.address.uri!}
          />
          <p className="text-wrap break-all text-gray text-sm">
            {quote.data?.address.address}
          </p>
        </div>
        <Separator className="my-2" />
        <div className="flex w-full justify-between items-center">
          <p className="text-gray">Time left to pay</p>
          <CountdownTimer
            targetTimeMs={quote.data?.quoteExpiryDate!}
            onExpire={onQuoteExpire}
          />
        </div>
        <Separator className="my-2" />
      </CardContent>
    </Card>
  );
};

export default PayQuoteCard;

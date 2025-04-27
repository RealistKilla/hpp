import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const ExpiredPage = () => {
  return (
    <Card className="py-28">
      <CardHeader>
        <span className="relative h-24 w-24">
          <Image
            src="/images/icons/error-icon.svg"
            alt="Error Icon"
            layout="fill"
          />
        </span>
        <h1>Payment Details Expired</h1>
      </CardHeader>
      <CardContent>
        <p className="text-gray">
          The payment details for your transaction have expired.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExpiredPage;

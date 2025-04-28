"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams, usePathname } from "next/navigation";
import {
  isCurrencySelectOpenAtom,
  quoteForCurrencyAtom,
  selectedCurrencyAtom,
  useQuoteQuery,
} from "../atoms/quote";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { currencies } from "../constants";
import { Currency, Quote } from "../lib/types";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/CountdownTimer";

import { acceptQuoteForCurrency } from "../services/acceptQuoteForCurrency";
import { useRouter } from "next/navigation";

type AcceptQuoteCardProps = {
  quote: Quote;
};
const AcceptQuoteCard: React.FC<AcceptQuoteCardProps> = ({
  quote: initialQuote,
}) => {
  const { uuid }: { uuid: string } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  // pass server quote to jotai atom
  const quote = useQuoteQuery(uuid, initialQuote);

  const [{ mutateAsync: updateQuote }] = useAtom(quoteForCurrencyAtom);

  // handles open and closing of currency select
  const [isCurrencySelectOpen, setIsCurrencySelectOpen] = useAtom(
    isCurrencySelectOpenAtom
  );

  // state for selected currency
  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);

  const handleCurrencySelect = async (currency: string) => {
    const fullCurrency: Currency | undefined = currencies.find(
      (c) => c.value === currency
    );
    if (fullCurrency) {
      setSelectedCurrency(fullCurrency);
      try {
        await updateQuote({
          uuid,
          currency: fullCurrency?.value!,
          payInMethod: "crypto",
        });

        await quote.refetch();
      } catch (error) {
        console.log("error", error);
      }
    }
    setIsCurrencySelectOpen(false);
  };

  // if the quote is expired, redirect to expired page

  // if we have a selected currency, fetch the quote for that currency

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col items-center">
            <h2>{quote?.data?.merchantDisplayName}</h2>
            <h2 className="text-3xl">
              {quote?.data?.displayCurrency.amount}
              <span className="text-lg pl-1">
                {quote?.data?.displayCurrency.currency}
              </span>
            </h2>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p>For reference number: {quote?.data?.reference}</p>
          </div>
        </div>
        <Popover
          open={isCurrencySelectOpen}
          onOpenChange={setIsCurrencySelectOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isCurrencySelectOpen}
              className="w-[200px] justify-between"
            >
              <p>{selectedCurrency?.label ?? "Select currency"}</p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search currency..." />
              <CommandList>
                <CommandEmpty>No currencies found.</CommandEmpty>
                <CommandGroup>
                  {currencies.map((currency: Currency) => (
                    <CommandItem
                      key={currency.value}
                      value={currency.value}
                      onSelect={(currentValue: Currency["value"]) => {
                        handleCurrencySelect(currentValue);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCurrency === currency
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {currency.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
      {quote?.data?.acceptanceExpiryDate && (
        <>
          <div>
            <p>Amount due:</p>
            <span>
              {quote?.data?.paidCurrency.amount}{" "}
              {quote?.data?.paidCurrency.currency}
            </span>
          </div>
          <div>
            <p>Quoted price expires in:</p>
            <CountdownTimer
              targetTimeMs={
                // quoteForCurrency.acceptanceExpiryDate ??
                quote?.data?.acceptanceExpiryDate
              }
              onExpire={async () => {
                try {
                  await updateQuote({
                    uuid,
                    currency: selectedCurrency?.value!,
                    payInMethod: "crypto",
                  });
                  const newQuote = await quote.refetch();

                  if (newQuote.data?.status === "ACCEPTED") {
                    router.replace(`${pathname}/pay`);
                  } else if (newQuote.data?.status === "EXPIRED") {
                    router.replace(`${pathname}/expired`);
                  }
                } catch (error) {
                  router.replace(`${pathname}/expired`);
                }
              }}
            />
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const result = await acceptQuoteForCurrency({
                  uuid: uuid,
                  successUrl: "no_url",
                });

                const newQuote = await quote.refetch();
                if (newQuote.data?.status === "ACCEPTED") {
                  router.replace(`${pathname}/pay`);
                } else if (newQuote.data?.status === "EXPIRED") {
                  router.replace(`${pathname}/expired`);
                }

                console.log("WE ARE IN THE ONCLICK BLOCK", result);
              } catch (error: any) {
                console.log("WE ARE IN THE CATCH BLOCK", error);
              }
            }}
          >
            Confirm
          </Button>
        </>
      )}
      {/* <div>{quoteForCurrencyError && <div className="text-red-500"> */}
      {/* {quoteForCurrencyError.</div>}</div> */}
    </Card>
  );
};

export default AcceptQuoteCard;

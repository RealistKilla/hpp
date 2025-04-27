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
  Quote,
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
import { Currency } from "../lib/types";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getQuoteForCurrency } from "../services/getQuoteForCurrency";
import { acceptQuoteForCurrency } from "../services/acceptQuoteForCurrency";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AcceptQuoteCardProps = {
  quote: Quote;
};
const AcceptQuoteCard: React.FC<AcceptQuoteCardProps> = ({ quote }) => {
  const { uuid }: { uuid: string } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  // pass server quote to jotai atom
  const quoteData = useQuoteQuery(uuid, quote);

  // handles open and closing of currency select
  const [isCurrencySelectOpen, setIsCurrencySelectOpen] = useAtom(
    isCurrencySelectOpenAtom
  );

  // state for selected currency
  const [selectedCurrency, setSelectedCurrency] = useAtom(selectedCurrencyAtom);
  const hasSelectedValue = !!selectedCurrency;
  const [
    {
      data: quoteForCurrency,
      mutate: mutateQuoteForCurrency,
      isPending: isPendingQuoteForCurrency,
      error: quoteForCurrencyError,
    },
  ] = useAtom(quoteForCurrencyAtom);
  // if the quote is expired, redirect to expired page
  useEffect(() => {
    if (quote?.status === "EXPIRED") {
      router.replace(`${pathname}/expired`);
    }
  }, [quote, router]);

  // if we have a selected currency, fetch the quote for that currency
  useEffect(() => {
    if (selectedCurrency) {
      mutateQuoteForCurrency({
        uuid: uuid,
        currency: selectedCurrency?.value!,
        payInMethod: "crypto",
      });
    }
  }, [selectedCurrency]);

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
                      onSelect={async (currentValue) => {
                        setSelectedCurrency(
                          currentValue === selectedCurrency?.value
                            ? undefined
                            : currencies.find((c) => c.value === currentValue)
                        );

                        setIsCurrencySelectOpen(false);
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
      {quoteForCurrency && (
        <>
          <div>
            <p>Amount due:</p>
            <span>
              {quoteForCurrency.paidCurrency.amount}{" "}
              {quoteForCurrency.paidCurrency.currency}
            </span>
          </div>
          <div>
            <p>Quoted price expires in:</p>
            <CountdownTimer
              targetTimeMs={quoteForCurrency.acceptanceExpiryDate}
              onExpire={() => {
                quoteData.refetch();
                getQuoteForCurrency({
                  uuid: uuid,
                  currency: selectedCurrency?.value!,
                  payInMethod: "crypto",
                });
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

                router.push(`/payin/${uuid}/pay`);
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

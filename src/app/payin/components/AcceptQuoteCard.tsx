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
import { useForm, Controller } from "react-hook-form";

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

  const getFullCurrency = (currency: string) => {
    return currencies.find((c) => c.value === currency);
  };

  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currency: "Please select a currency...",
    },
  });
  const handleCurrencySelect = async (currency: string) => {
    const fullCurrency = getFullCurrency(currency);

    // when we select a currency we want to fetch a new quote for currency as well as refetch the quote summary
    if (fullCurrency) {
      setSelectedCurrency(fullCurrency);
      if (!errors.currency) {
        try {
          await updateQuote({
            uuid,
            currency: getValues("currency"),
            payInMethod: "crypto",
          });

          await quote.refetch();
        } catch (error) {
          console.log("error", error);
        }
      }
    }
    setIsCurrencySelectOpen(false);
  };

  // if the quote is expired, redirect to expired page
  const redirectToCorrectPage = (status: Quote["status"]) => {
    if (status === "ACCEPTED") {
      router.replace(`${pathname}/pay`);
    } else if (status === "EXPIRED") {
      router.replace(`${pathname}/expired`);
    }
  };

  const onAcceptClick = async () => {
    try {
      await acceptQuoteForCurrency({
        uuid: uuid,
        successUrl: "no_url",
      });

      const newQuote = await quote.refetch();
      newQuote.data && redirectToCorrectPage(newQuote.data?.quoteStatus);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  const onQuoteExpire = async () => {
    try {
      await updateQuote({
        uuid,
        currency: selectedCurrency?.value!,
        payInMethod: "crypto",
      });
      const newQuote = await quote.refetch();

      newQuote.data && redirectToCorrectPage(newQuote.data?.status);
    } catch (error) {
      router.replace(`${pathname}/expired`);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col items-center">
            <h1>{quote?.data?.merchantDisplayName}</h1>
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
        <form onSubmit={handleSubmit(onAcceptClick)}>
          <Controller
            name="currency"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Popover
                open={isCurrencySelectOpen}
                onOpenChange={setIsCurrencySelectOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    data-testid="currency-selector"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCurrencySelectOpen}
                    className="w-[200px] justify-between"
                  >
                    <p>{getValues("currency")}</p>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  data-testid="currency-menu"
                  className="w-[200px] p-0"
                >
                  <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandList>
                      <CommandEmpty>No currencies found.</CommandEmpty>
                      <CommandGroup>
                        {currencies.map((currency: Currency) => (
                          <CommandItem
                            data-testid="currency-item"
                            key={currency.value}
                            value={currency.value}
                            onSelect={(currentValue: Currency["value"]) => {
                              field.onChange(currentValue);
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
            )}
          />
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
                  onExpire={onQuoteExpire}
                />
              </div>
              <Button
                data-testid="accept-button"
                variant="outline"
                type="submit"
              >
                Confirm
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AcceptQuoteCard;

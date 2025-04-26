import { atom, useAtomValue } from "jotai";
import { z } from "zod";
import { getQuote } from "../services/getQuote";
import { atomWithQuery } from "jotai-tanstack-query";
import { useMemo } from "react";

export const quoteSchema = z.object({
  merchantDisplayName: z.string(),
  displayCurrency: z.object({
    amount: z.string(),
    currency: z.string(),
  }),
  reference: z.string(),
});

type Quote = z.infer<typeof quoteSchema>;

export function useQuote(uuid: string, initialData: Quote) {
  const quoteAtom = useMemo(
    () =>
      atomWithQuery<Quote | null>(() => ({
        queryKey: ["quote", initialData.reference],
        queryFn: () => getQuote(uuid),
        initialData: initialData,
      })),
    [uuid, initialData]
  );

  return useAtomValue(quoteAtom);
}

export const currencyAtom = atom<string>("USD");

export const isCurrencySelectOpenAtom = atom<boolean>(false);

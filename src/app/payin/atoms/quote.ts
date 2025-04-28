import { atom, useAtomValue } from "jotai";
import { z } from "zod";
import { getQuoteSummary } from "../services/getQuoteSummary";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { useMemo } from "react";
import { Currency, GetQuoteForCurrencyBody } from "../lib/types";
import { getQuoteForCurrency } from "../services/getQuoteForCurrency";
import { AxiosError } from "axios";

export const quoteSchema = z.object({
  status: z.string(),
  acceptanceExpiryDate: z.number(),
  merchantDisplayName: z.string(),
  displayCurrency: z.object({
    amount: z.string(),
    currency: z.string(),
  }),
  paidCurrency: z.object({
    amount: z.string(),
    currency: z.string(),
  }),
  reference: z.string(),
  quoteExpiryDate: z.number(),
});

export type Quote = z.infer<typeof quoteSchema>;

export const useQuoteQuery = (uuid: string, initialData: Quote) => {
  const quoteAtom = useMemo(
    () =>
      atomWithQuery<Quote | null>(() => ({
        queryKey: ["quote", initialData.reference],
        queryFn: () => getQuoteSummary(uuid),
        initialData: initialData,
      })),
    [uuid, initialData]
  );

  return useAtomValue(quoteAtom);
};

export const quoteForCurrencyAtom = atomWithMutation<
  Quote,
  GetQuoteForCurrencyBody,
  Error
>(() => ({
  mutationKey: ["quote"],
  mutationFn: (body) => getQuoteForCurrency(body),
}));

export const quoteForCurrencyExpiredAtom = atom<boolean>(false);

export const selectedCurrencyAtom = atom<Currency | undefined>(undefined);

export const isCurrencySelectOpenAtom = atom<boolean>(false);

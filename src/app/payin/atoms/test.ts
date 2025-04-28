// atoms/quote.ts
import {
  atomWithQuery,
  atomWithMutation,
  queryClientAtom,
} from "jotai-tanstack-query";
import { getQuoteSummary } from "../services/getQuoteSummary";
import { getQuoteForCurrency } from "../services/getQuoteForCurrency";
import type { Quote, GetQuoteForCurrencyBody, Currency } from "../lib/types";
import { atom, useAtom } from "jotai";
import { useMemo } from "react";

/** 1) Query Atom — useQuery under the hood */
export const quoteQueryAtom = (uuid: string, initial: Quote) =>
  // useMemo(
  //   () =>
  atomWithQuery<Quote>(() => ({
    queryKey: ["quote", uuid],
    queryFn: () => getQuoteSummary(uuid),
    initialData: initial,
  }));
//   [uuid]
// );

/** 2) Mutation Atom — useMutation under the hood, patches cache onSuccess */
export const quoteMutationAtom = (uuid: string) =>
  // useMemo(
  //   () =>
  atomWithMutation<Quote, GetQuoteForCurrencyBody>(
    (get) => ({
      mutationKey: ["quote", uuid],
      mutationFn: (body) =>
        getQuoteForCurrency({
          uuid,
          currency: body.currency,
          payInMethod: body.payInMethod,
        }),
      onSuccess: (data) => {
        const qc = get(queryClientAtom);
        qc.setQueryData(["quote", uuid], data);
      },
    }),
    (get) => get(queryClientAtom)
  );
//   [uuid]
// );

/** 3) Hook — expose query result + mutate fn */
export function useQuote(uuid: string, initial: Quote) {
  const [quote] = useAtom(quoteQueryAtom(uuid, initial));
  const [{ mutate }] = useAtom(quoteMutationAtom(uuid));
  return { quote, updateQuote: mutate };
}

export const quoteForCurrencyExpiredAtom = atom<boolean>(false);

export const selectedCurrencyAtom = atom<Currency | undefined>(undefined);

export const isCurrencySelectOpenAtom = atom<boolean>(false);

import { atom, useAtomValue } from "jotai";
import { z } from "zod";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";
import { useMemo } from "react";

import { getQuoteSummary } from "../services/getQuoteSummary";
import { getQuoteForCurrency } from "../services/getQuoteForCurrency";
import { acceptQuoteForCurrency } from "../services/acceptQuoteForCurrency";
import {
  Currency,
  GetQuoteForCurrencyBody,
  AcceptQuoteForCurrencyBody,
  Quote,
} from "../lib/types";

export const useQuoteQuery = (uuid: string, initialData: Quote) => {
  // memoize the atom to prevent it from being recreated on every render
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

export const acceptQuoteForCurrencyAtom = atomWithMutation<
  Quote,
  AcceptQuoteForCurrencyBody,
  Error
>(() => ({
  mutationKey: ["quote"],
  mutationFn: (body) => acceptQuoteForCurrency(body),
}));

export const quoteForCurrencyExpiredAtom = atom<boolean>(false);

export const selectedCurrencyAtom = atom<Currency | undefined>(undefined);

export const isCurrencySelectOpenAtom = atom<boolean>(false);

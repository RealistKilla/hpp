import { z } from "zod";

export const acceptQuoteForCurrencySchema = z.object({
  uuid: z.string(),
  successUrl: z.string(),
});

export const getQuoteForCurrencySchema = z.object({
  uuid: z.string(),
  currency: z.string(),
  payInMethod: z.string(),
});

export const getQuoteSummarySchema = z.object({
  uuid: z.string(),
});

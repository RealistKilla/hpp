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

export const quoteSchema = z.object({
  status: z.string(),
  uuid: z.string(),
  quoteStatus: z.string(),
  address: z.object({
    address: z.string(),
    protocol: z.string(),
    uri: z.string(),
  }),
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

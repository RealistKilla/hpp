import { z } from "zod";

export type Currency = {
  label: string;
  value: string;
};

export type GetQuoteForCurrencyBody = {
  uuid: string;
  currency: string;
  payInMethod: string;
};

export type AcceptQuoteForCurrencyBody = {
  uuid: string;
  successUrl: string;
};

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

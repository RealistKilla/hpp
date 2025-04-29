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
  address: z
    .object({
      address: z.string(),
      protocol: z.string(),
      uri: z.string(),
    })
    .nullable(),
  acceptanceExpiryDate: z.number().nullable(),
  merchantDisplayName: z.string(),
  merchantId: z.string(),
  dateCreated: z.number(),
  expiryDate: z.number(),
  type: z.string(),
  subType: z.string(),
  flow: z.string(),
  twoStep: z.boolean(),
  customerId: z.string(),
  networkFeeBilledTo: z.string(),
  networkFeeRates: z.array(z.object({})),
  walletId: z.string(),
  walletCurrency: z.object({
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    actual: z.number().nullable(),
  }),
  displayCurrency: z.object({
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    actual: z.number().nullable(),
  }),
  paidCurrency: z.object({
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    actual: z.number().nullable(),
  }),
  feeCurrency: z.object({
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    actual: z.number().nullable(),
  }),
  networkFeeCurrency: z.object({
    amount: z.number().nullable(),
    currency: z.string().nullable(),
    actual: z.number().nullable(),
  }),
  displayRate: z.number().nullable(),
  exchangeRate: z.number().nullable(),
  redirectUrl: z.string(),
  reference: z.string(),
  quoteExpiryDate: z.number().nullable(),
  returnUrl: z.string(),
  transactions: z.array(z.object({})),
  refund: z.object({}).nullable(),
  refunds: z.array(z.object({})),
  currencyOptions: z.array(z.object({})),
});

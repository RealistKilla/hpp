import { z } from "zod";
import {
  acceptQuoteForCurrencySchema,
  getQuoteForCurrencySchema,
  quoteSchema,
} from "../validation/schema";

export type Currency = {
  label: string;
  value: string;
};

export type GetQuoteForCurrencyBody = z.infer<typeof getQuoteForCurrencySchema>;

export type AcceptQuoteForCurrencyBody = z.infer<
  typeof acceptQuoteForCurrencySchema
>;

export type Quote = z.infer<typeof quoteSchema>;

export enum CurrencyName {
  BTC = "Bitcoin",
  ETH = "Ethereum",
  LTC = "Litecoin",
}

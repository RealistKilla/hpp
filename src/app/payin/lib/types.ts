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

"use client";
import { GetQuoteForCurrencyBody } from "../lib/types";
import { AxiosResponse } from "axios";
import { Quote } from "../lib/types";
import { api } from "@/lib/api";

const errors: Record<string, string> = {
  "MER-PAY-2017": "Payment link expired, please generate a new one.",
};

export const getQuoteForCurrency = async (body: GetQuoteForCurrencyBody) => {
  const safeUUID = encodeURIComponent(body.uuid);

  try {
    const response: AxiosResponse<Quote> = await api.put(
      `pay/${safeUUID}/update/summary`,
      { currency: body.currency, payInMethod: body.payInMethod }
    );
    console.log("response", response);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

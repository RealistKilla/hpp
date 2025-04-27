"use client";
import { GetQuoteForCurrencyBody } from "../lib/types";
import { AxiosResponse } from "axios";
import { Quote } from "../atoms/quote";
import { api } from "@/lib/api";

const errors: Record<string, string> = {
  "MER-PAY-2017": "Payment link expired, please generate a new one.",
};

export const getQuoteForCurrency = async (body: GetQuoteForCurrencyBody) => {
  const safeUUID = encodeURIComponent(body.uuid);
  console.log("getQuoteForCurrency RUNNING", body);
  try {
    const response: AxiosResponse<Quote> = await api.put(
      `pay/${safeUUID}/update/summary`,
      { currency: body.currency, payinMethod: body.payInMethod }
    );
    console.log("response", response);
    return response.data;
  } catch (error: any) {
    console.log("error", error.response);
    throw error.response;
  }
};

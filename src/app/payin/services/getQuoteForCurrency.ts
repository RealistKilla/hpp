"use client";
import { GetQuoteForCurrencyBody } from "../lib/types";
import { AxiosResponse } from "axios";
import { Quote } from "../lib/types";
import { api } from "@/lib/api";
import { getQuoteForCurrencySchema } from "../validation/schema";

const errors: Record<string, string> = {
  "MER-PAY-2017": "Payment link expired, please generate a new one.",
};

export const getQuoteForCurrency = async (body: GetQuoteForCurrencyBody) => {
  const safeUUID = encodeURIComponent(body.uuid);

  const validationResult = getQuoteForCurrencySchema.safeParse({
    ...body,
    safeUUID,
  });

  if (!validationResult.success) {
    throw new Error("Vaidation failed", validationResult.error);
  }

  try {
    const response: AxiosResponse<Quote> = await api.put(
      `pay/${safeUUID}/update/summary`,
      { currency: body.currency, payInMethod: body.payInMethod }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

"use client";
import { AcceptQuoteForCurrencyBody } from "../lib/types";
import { AxiosResponse } from "axios";
import { Quote } from "../lib/types";

import { api } from "@/lib/api";

export const acceptQuoteForCurrency = async (
  body: AcceptQuoteForCurrencyBody
): Promise<Quote> => {
  const safeUUID = encodeURIComponent(body.uuid);
  try {
    const response: AxiosResponse<Quote> = await api.put(
      `pay/${safeUUID}/accept`,
      { successUrl: body.successUrl }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

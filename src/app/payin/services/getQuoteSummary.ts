import { api } from "@/lib/api";
import { Quote } from "../atoms/quote";
import { AxiosResponse } from "axios";

export const getQuoteSummary = async (uuid: string) => {
  const safeUUID = encodeURIComponent(uuid);
  try {
    const response: AxiosResponse<Quote> = await api.get(
      `pay/${safeUUID}/summary`
    );

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

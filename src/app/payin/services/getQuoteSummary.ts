import { api } from "@/lib/api";
import { Quote } from "../lib/types";
import { AxiosResponse } from "axios";
import { bvnkApi } from "@/lib/bvnkApi";
import { getQuoteSummarySchema } from "../validation/schema";

export const getQuoteSummary = async (uuid: string, isServer?: boolean) => {
  const safeUUID = encodeURIComponent(uuid);

  const validationResult = getQuoteSummarySchema.safeParse({ uuid });

  if (!validationResult.success) {
    throw new Error("Vaidation failed", validationResult.error);
  }

  try {
    const response: AxiosResponse<Quote> = await (isServer ? bvnkApi : api).get(
      `pay/${safeUUID}/summary`
    );

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

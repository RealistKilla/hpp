import { api } from "@/lib/api";
import { Quote } from "../lib/types";
import { AxiosResponse } from "axios";
import { bvnkApi } from "@/lib/bvnkApi";

export const getQuoteSummary = async (uuid: string, isServer?: boolean) => {
  const safeUUID = encodeURIComponent(uuid);

  try {
    const response: AxiosResponse<Quote> = await (isServer ? bvnkApi : api).get(
      `pay/${safeUUID}/summary`
    );

    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

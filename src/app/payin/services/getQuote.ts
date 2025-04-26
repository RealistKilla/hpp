"use server";

// marked as use server because this function should only run on the server.
import { bvnkApi } from "@/app/util/bvnkApi";

export const getQuote = async (uuid: string, isClient = false) => {
  const safeUUID = encodeURIComponent(uuid);
  try {
    const response = await bvnkApi.get(`pay/${safeUUID}/summary`);

    return response.data;
  } catch (error: any) {
    console.log("Error fetching quote", error.response.data);
    return null;
  }
};

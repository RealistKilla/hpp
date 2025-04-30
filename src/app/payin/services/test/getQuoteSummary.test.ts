import { getQuoteSummary } from "../getQuoteSummary"; // adjust path as needed
import { api } from "@/lib/api";
import uuid from "./services.fixtures";
import fullQuote from "../../atoms/test/quote.fixtures";
import { bvnkApi } from "@/lib/bvnkApi";
import { Quote } from "../lib/types";

jest.mock("@/lib/api", () => ({
  api: { get: jest.fn() },
}));

jest.mock("@/lib/bvnkApi", () => ({
  bvnkApi: { get: jest.fn() },
}));

const mockQuote: Quote = fullQuote;

describe("getQuoteSummary", () => {
  it("calls client API and returns quote when isServer is false", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockQuote });

    const result = await getQuoteSummary(
      "3addda90-0d9a-4fb5-813b-072e53ac7f6e"
    );

    expect(api.get).toHaveBeenCalledWith(
      `pay/3addda90-0d9a-4fb5-813b-072e53ac7f6e/summary`
    );
    expect(result).toEqual(mockQuote);
  });

  it("calls server API and returns quote when isServer is true", async () => {
    (bvnkApi.get as jest.Mock).mockResolvedValueOnce({ data: mockQuote });

    const result = await getQuoteSummary(
      "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
      true
    );

    expect(bvnkApi.get).toHaveBeenCalledWith(
      `pay/3addda90-0d9a-4fb5-813b-072e53ac7f6e/summary`
    );
    expect(result).toEqual(mockQuote);
  });

  it("throws error on API failure", async () => {
    const error = new Error("Network error");
    (api.get as jest.Mock).mockRejectedValueOnce(error);

    await expect(
      getQuoteSummary("3addda90-0d9a-4fb5-813b-072e53ac7f6e")
    ).rejects.toThrow("Network error");
  });
});

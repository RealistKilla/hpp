import { getQuoteForCurrency } from "../getQuoteForCurrency";
import { api } from "@/lib/api";
import { GetQuoteForCurrencyBody, Quote } from "../../lib/types";
import { fullQuote } from "../../atoms/test/quote.fixtures";

jest.mock("@/lib/api", () => ({
  api: {
    put: jest.fn(),
  },
}));

const mockedApi = api.put as jest.Mock;

describe("getQuoteForCurrency", () => {
  const mockBody: GetQuoteForCurrencyBody = {
    uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
    currency: "BTC",
    payInMethod: "crypto",
  };

  const mockQuote: Quote = fullQuote;

  it("sends the correct PUT request and returns the quote", async () => {
    mockedApi.mockResolvedValueOnce({ data: mockQuote });

    const result = await getQuoteForCurrency(mockBody);

    expect(mockedApi).toHaveBeenCalledWith(
      `pay/3addda90-0d9a-4fb5-813b-072e53ac7f6e/update/summary`,
      {
        currency: "BTC",
        payInMethod: "crypto",
      }
    );
    expect(result).toEqual(mockQuote);
  });

  it("throws if the API call fails", async () => {
    mockedApi.mockRejectedValueOnce(new Error("Network error"));

    await expect(getQuoteForCurrency(mockBody)).rejects.toThrow(
      "Network error"
    );
  });
});

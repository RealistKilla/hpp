import { acceptQuoteForCurrency } from "../acceptQuoteForCurrency";
import { api } from "@/lib/api";

import { fullQuote } from "../../atoms/test/quote.fixtures";
import Quote from "../../lib/types";
import { AcceptQuoteForCurrencyBody } from "../../lib/types";

jest.mock("@/lib/api", () => ({
  api: {
    put: jest.fn(),
  },
}));

const mockedApi = api.put as jest.Mock;

describe("acceptQuoteForCurrency", () => {
  const mockBody: AcceptQuoteForCurrencyBody = {
    uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
    successUrl: "https://example.com/success",
  };

  const mockQuote: Quote = fullQuote;

  it("sends the correct PUT request and returns the quote", async () => {
    mockedApi.mockResolvedValueOnce({ data: mockQuote });

    const result = await acceptQuoteForCurrency(mockBody);

    expect(mockedApi).toHaveBeenCalledWith(
      `pay/3addda90-0d9a-4fb5-813b-072e53ac7f6e/accept`,
      {
        successUrl: "https://example.com/success",
      }
    );
    expect(result).toEqual(mockQuote);
  });

  it("throws if the API call fails", async () => {
    mockedApi.mockRejectedValueOnce(new Error("Network error"));

    await expect(acceptQuoteForCurrency(mockBody)).rejects.toThrow(
      "Network error"
    );
  });
});

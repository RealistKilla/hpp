import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider, useSetAtom, useAtomValue } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { quoteForCurrencyAtom } from "../quote"; // your atom file
import { getQuoteForCurrency } from "../../services/getQuoteForCurrency";
import { fullQuote } from "./quote.fixtures";

// 🔁 Mock the service
jest.mock("../../services/getQuoteForCurrency", () => ({
  getQuoteForCurrency: jest.fn(),
}));

const mockGetQuoteForCurrency = getQuoteForCurrency as jest.Mock;

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <JotaiProvider>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </JotaiProvider>
  );
};

describe("quote for currency atom integration test", () => {
  it("successfully mutates and returns data", async () => {
    mockGetQuoteForCurrency.mockResolvedValueOnce(fullQuote);

    const { result } = renderHook(
      () => {
        const mutation = useAtomValue(quoteForCurrencyAtom);
        return mutation;
      },
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.mutate({
        uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
        currency: "BTC",
        payInMethod: "crypto",
      });
    });

    await waitFor(() => {
      expect(mockGetQuoteForCurrency).toHaveBeenCalledWith({
        uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
        currency: "BTC",
        payInMethod: "crypto",
      });
      // expect(result.current.data).toBe(fullQuote);
      expect(result.current.data).toEqual(fullQuote);
    });
  });

  it("handles mutation error", async () => {
    mockGetQuoteForCurrency.mockRejectedValueOnce(new Error("API failure"));

    const { result } = renderHook(
      () => {
        const mutation = useAtomValue(quoteForCurrencyAtom);
        return mutation;
      },
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.mutate({
        uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
        currency: "BTC",
        payInMethod: "crypto",
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("API failure");
    });
  });
});

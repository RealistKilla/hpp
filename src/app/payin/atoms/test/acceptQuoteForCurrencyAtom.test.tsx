import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider, useSetAtom, useAtomValue } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { acceptQuoteForCurrencyAtom } from "../quote"; // your atom file
import { acceptQuoteForCurrency } from "../../services/acceptQuoteForCurrency";
import { fullQuote } from "./quote.fixtures";

// 🔁 Mock the service
jest.mock("../../services/acceptQuoteForCurrency", () => ({
  acceptQuoteForCurrency: jest.fn(),
}));

const mockAcceptQuoteForCurrency = acceptQuoteForCurrency as jest.Mock;

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <JotaiProvider>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </JotaiProvider>
  );
};

describe("accept quote for currency atom integration test", () => {
  it("successfully mutates and returns data", async () => {
    mockAcceptQuoteForCurrency.mockResolvedValueOnce(fullQuote);

    const { result } = renderHook(
      () => {
        const mutation = useAtomValue(acceptQuoteForCurrencyAtom);
        return mutation;
      },
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.mutate({
        uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
        successUrl: "https://example.com/success",
      });
    });

    await waitFor(() => {
      expect(mockAcceptQuoteForCurrency).toHaveBeenCalledWith({
        uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
        successUrl: "https://example.com/success",
      });
      // expect(result.current.data).toBe(fullQuote);
      expect(result.current.data).toEqual(fullQuote);
    });
  });

  it("handles mutation error", async () => {
    mockAcceptQuoteForCurrency.mockRejectedValueOnce(new Error("API failure"));

    const { result } = renderHook(
      () => {
        const mutation = useAtomValue(acceptQuoteForCurrencyAtom);
        return mutation;
      },
      {
        wrapper: createWrapper(),
      }
    );

    act(() => {
      result.current.mutate({
        uuid: "3addda90-0d9a-4fb5-813b-072e53ac7f6e",
        successUrl: "https://example.com/success",
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe("API failure");
    });
  });
});

import "@testing-library/jest-dom";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQuoteQuery } from "../quote";
import { fullQuote } from "./quote.fixtures";

beforeAll(() => {
  jest.doMock("../../services/getQuoteSummary", () => ({
    __esModule: true,
    getQuoteSummary: jest.fn().mockResolvedValue(fullQuote),
  }));
});

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <JotaiProvider>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </JotaiProvider>
  );
};

describe("useQuoteQuery", () => {
  it("returns initialData immediately and updates from service", async () => {
    const { result } = renderHook(() => useQuoteQuery("uuid-1", fullQuote), {
      wrapper: createWrapper(),
    });

    // initialData is returned synchronously
    expect(result.current.data).toEqual(fullQuote);

    // then the query runs and updates value
    await waitFor(() => {
      expect(result.current.data?.displayCurrency.amount).toBe(200);
    });
  });
});

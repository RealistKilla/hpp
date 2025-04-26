"use client";
import { Provider } from "jotai";
import React from "react";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type JotaiProviderProps = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: JotaiProviderProps) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

const JotaiProvider = ({ children }: JotaiProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>{children}</HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  );
};

export default JotaiProvider;

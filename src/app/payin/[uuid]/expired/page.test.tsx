// app/expired/page.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import ExpiredPage from "./page";
// 1. Mock next/image so it just renders an <img> with the given props
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("ExpiredPage", () => {
  beforeEach(() => {
    render(<ExpiredPage />);
  });

  it("renders the error icon with correct alt text", () => {
    // next/image is mocked to <img />, so we can query by alt text
    const img = screen.getByAltText("Error Icon");
    expect(img).toBeInTheDocument();
  });

  it("renders the primary heading", () => {
    // the page uses an <h1> with "Payment Details Expired"
    const heading = screen.getByRole("heading", {
      name: /payment details expired/i,
    });
    expect(heading).toBeVisible();
  });

  it("renders the explanatory paragraph", () => {
    const text = screen.getByText(
      /the payment details for your transaction have expired\./i
    );
    expect(text).toBeInTheDocument();
  });
});

import { truncateMiddle } from "./truncateMiddle"; // adjust path as needed

describe("truncateMiddle", () => {
  it("returns the original string if length is less than or equal to maxLength", () => {
    expect(truncateMiddle("hello", 10)).toBe("hello");
    expect(truncateMiddle("hello", 5)).toBe("hello");
  });

  it("truncates the middle of a long string", () => {
    const result = truncateMiddle("abcdefghij", 7);
    expect(result).toBe("ab...ij");
  });

  it("works with even and odd maxLength values", () => {
    expect(truncateMiddle("abcdefghij", 8)).toBe("ab...ij"); // half = 2.5 → 2
    expect(truncateMiddle("abcdefghij", 9)).toBe("abc...hij"); // half = 3
  });

  it("handles small maxLength edge cases", () => {
    expect(truncateMiddle("abcdefghij", 3)).toBe("...");
    expect(truncateMiddle("abcdefghij", 5)).toBe("a...j");
  });

  it("returns empty string unchanged", () => {
    expect(truncateMiddle("", 10)).toBe("");
  });
});

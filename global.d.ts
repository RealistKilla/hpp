import { expect } from "@jest/globals";
import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "expect" {
  interface Matchers<R = void>
    extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}

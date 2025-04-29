import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  jest: {
    // Add any custom config to be passed to Jest
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  },
};

export default nextConfig;

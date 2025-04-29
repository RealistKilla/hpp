import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    generated_uuid: "94423e7f-90b9-48f1-882b-20e618c7e754",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    generated_uuid: "[REPLACE_WITH_UUID]",
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

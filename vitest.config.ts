import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // One runner for the whole workspace. Only pure modules are tested here —
    // anything needing a browser DOM belongs in its own project config.
    environment: "node",
    include: ["{apps,packages}/*/src/**/*.test.ts"],
  },
});

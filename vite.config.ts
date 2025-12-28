import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      // Ignore test files so they don't get processed as routes
      ignoredRouteFiles: ["**/*.test.*", "**/*.spec.*"],
    }),
  ],
});


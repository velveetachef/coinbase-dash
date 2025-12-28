import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  plugins: [
    {
      name: "css-module-mock",
      enforce: "pre",
      load(id) {
        if (id.endsWith(".module.css")) {
          return "export default {};";
        }
        if (id.endsWith(".css")) {
          return "";
        }
      },
    },
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "build", ".react-router"],
  },
});


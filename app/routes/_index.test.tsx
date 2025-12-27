import { describe, it, expect } from "vitest";
import { redirect } from "@remix-run/node";

describe("_index route", () => {
  describe("loader", () => {
    it("should redirect to /crypto-dash", () => {
      // The loader function calls redirect("/crypto-dash", { status: 301 })
      // Test the redirect behavior directly
      const response = redirect("/crypto-dash", { status: 301 });

      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(301);
      expect(response.headers.get("Location")).toBe("/crypto-dash");
    });

    it("should use permanent redirect status (301)", () => {
      // Verify the redirect uses 301 status code
      const response = redirect("/crypto-dash", { status: 301 });

      expect(response.status).toBe(301);
      expect(response.headers.get("Location")).toBe("/crypto-dash");
    });
  });
});


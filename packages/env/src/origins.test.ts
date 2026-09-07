import { describe, expect, it } from "vitest";

import { parseOriginList } from "./origins";

describe("parseOriginList", () => {
  it("reads a single origin", () => {
    expect(parseOriginList("https://foo.com")).toEqual(["https://foo.com"]);
  });

  it("splits a comma-separated list and trims each entry", () => {
    expect(parseOriginList("https://foo.com, https://staff.foo.com")).toEqual([
      "https://foo.com",
      "https://staff.foo.com",
    ]);
  });

  it("drops empty entries left by trailing or doubled commas", () => {
    expect(parseOriginList("https://foo.com,,https://api.foo.com,")).toEqual([
      "https://foo.com",
      "https://api.foo.com",
    ]);
  });

  it("keeps the first occurrence of a repeated origin", () => {
    expect(parseOriginList("https://foo.com,https://foo.com")).toEqual([
      "https://foo.com",
    ]);
  });

  it("returns nothing for a blank value", () => {
    expect(parseOriginList("   ")).toEqual([]);
  });
});

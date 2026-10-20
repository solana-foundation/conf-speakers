import { sanitizeXLink, sanitizeXName } from "./utils";

describe("sanitizeXName", () => {
  test("should handle basic handle formats", () => {
    expect(sanitizeXName("johndoe")).toBe("johndoe");
    expect(sanitizeXName("@johndoe")).toBe("johndoe");
    expect(sanitizeXName("  johndoe  ")).toBe("johndoe");
    expect(sanitizeXName("https://x.com/johndoe?ref=event")).toBe("johndoe");
    expect(sanitizeXName("N/A")).toBeNull();
    expect(sanitizeXName("https://example.com/johndoe")).toBeNull();
  });
});

describe("sanitizeXLink", () => {
  test("should handle basic handle formats", () => {
    expect(sanitizeXLink("johndoe")).toBe("https://x.com/johndoe");
    expect(sanitizeXLink("@johndoe")).toBe("https://x.com/johndoe");
    expect(sanitizeXLink("  johndoe  ")).toBe("https://x.com/johndoe");
    expect(sanitizeXLink("N/A")).toBeNull();
  });
});

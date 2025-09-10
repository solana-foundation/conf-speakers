import { sanitizeXLink, sanitizeXName } from "./utils";

describe("sanitizeXName", () => {
  test("should handle basic handle formats", () => {
    expect(sanitizeXName("johndoe")).toBe("johndoe");
    expect(sanitizeXName("@johndoe")).toBe("johndoe");
    expect(sanitizeXName("  johndoe  ")).toBe("johndoe");
  });
});

describe("sanitizeXLink", () => {
  test("should handle basic handle formats", () => {
    expect(sanitizeXLink("johndoe")).toBe("https://x.com/johndoe");
    expect(sanitizeXLink("@johndoe")).toBe("https://x.com/johndoe");
    expect(sanitizeXLink("  johndoe  ")).toBe("https://x.com/johndoe");
  });
});

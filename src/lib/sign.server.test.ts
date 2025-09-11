import { generateKey, getTokenPayload, isKeyValid } from "./sign.server";

// Mock environment variable
const originalEnv = process.env.SITE_SECRET;

describe("sign.server", () => {
  beforeEach(() => {
    // Set up test environment
    process.env.SITE_SECRET = "test-secret-key";
  });

  afterEach(() => {
    // Restore original environment
    process.env.SITE_SECRET = originalEnv;
  });

  describe("generateKey", () => {
    test("should generate JWT with exp and slug parameters", () => {
      const exp = Date.now() + 3600000;
      const slug = "test-slug";

      const result = generateKey(exp, slug);

      // Should return JWT format: header.payload.signature
      expect(result.split(".").length).toBe(3);

      const payload = getTokenPayload(result);
      expect(payload?.slug).toBe(slug);
      expect(payload?.exp).toBe(Math.floor(Number(exp) / 1000));
    });

    test("should generate consistent JWT for same inputs", () => {
      const exp = Date.now() + 3600000;
      const slug = "test-slug";

      const result1 = generateKey(exp, slug);
      const result2 = generateKey(exp, slug);

      expect(result1).toBe(result2);
    });

    test("should generate different JWT for different inputs", () => {
      const exp1 = Date.now() + 3600000;
      const exp2 = Date.now() + 3600000 + 1000;
      const slug = "test-slug";

      const result1 = generateKey(exp1, slug);
      const result2 = generateKey(exp2, slug);

      expect(result1).not.toBe(result2);
    });
  });

  describe("isKeyValid", () => {
    test("should validate correct key with slug", () => {
      const exp = Date.now() + 3600000; // 1 hour from now
      const slug = "test-slug";
      const validKey = generateKey(exp, slug);

      expect(isKeyValid(validKey, slug)).toBe(true);
    });
  });

  describe("getTokenPayload", () => {
    test("should return payload for valid key", () => {
      const exp = Date.now() + 3600000;
      const slug = "test-slug";
      const validKey = generateKey(exp, slug);

      expect(getTokenPayload(validKey)).toBeDefined();
    });
    test("should store speakerId in payload if provided", () => {
      const exp = Date.now() + 3600000;
      const slug = "test-slug";
      const speakerId = "rec1234567890";
      const validKey = generateKey(exp, slug, speakerId);

      expect(getTokenPayload(validKey)?.speakerId).toBe(speakerId);
    });
    test("should return null for invalid key", () => {
      const invalidKey = "invalid-key";

      expect(getTokenPayload(invalidKey)).toBeNull();
    });
  });
});

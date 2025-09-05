import { generateKey, isKeyValid } from "./sign.server";

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
    test("should generate HMAC with exp and slug parameters", () => {
      const exp = "1234567890000";
      const slug = "test-slug";

      const result = generateKey(exp, slug);

      // Should return format: hmac.exp
      expect(result).toMatch(/^[A-Za-z0-9_-]+\.[0-9]+$/);

      const [hmac, returnedExp] = result.split(".");

      expect(returnedExp).toBe(exp);
      expect(hmac).toBeTruthy();
      expect(hmac.length).toBeGreaterThan(0);
    });

    test("should generate consistent HMAC for same inputs", () => {
      const exp = "1234567890000";
      const slug = "test-slug";

      const result1 = generateKey(exp, slug);
      const result2 = generateKey(exp, slug);

      expect(result1).toBe(result2);
    });

    test("should generate different HMAC for different inputs", () => {
      const exp1 = "1234567890000";
      const exp2 = "1234567891";
      const slug = "test-slug";

      const result1 = generateKey(exp1, slug);
      const result2 = generateKey(exp2, slug);

      expect(result1).not.toBe(result2);
    });
  });

  describe("isKeyValid", () => {
    test("should validate correct key with slug", () => {
      const exp = Math.floor(Date.now() + 3600000).toString(); // 1 hour from now
      const slug = "test-slug";
      const validKey = generateKey(exp, slug);

      expect(isKeyValid(validKey, slug)).toBe(true);
    });
  });
});

import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock environment variables
process.env.SITE_SECRET = "test-secret-key";
process.env.AIRTABLE_PAT = "test-pat";
process.env.AIRTABLE_BASE = "test-base";
process.env.AIRTABLE_TABLE_SPEAKERS = "Speakers";
process.env.AIRTABLE_TABLE_AGENDA = "Sessions";
process.env.NEXT_PUBLIC_VENUE_TZ = "Asia/Dubai";

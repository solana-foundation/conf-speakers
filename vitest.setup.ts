import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

process.env.SITE_SECRET = "test-secret-key";
process.env.AIRTABLE_PAT = "test-pat";
process.env.AIRTABLE_BASE = "test-base";
process.env.AIRTABLE_TABLE_SPEAKERS = "Speakers";
process.env.AIRTABLE_TABLE_AGENDA = "Sessions";
process.env.NEXT_PUBLIC_VENUE_TZ = "Asia/Dubai";

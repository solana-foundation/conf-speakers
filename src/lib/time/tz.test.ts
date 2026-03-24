import { DateTime } from "luxon";

// Mock the environment variable for testing
const originalEnv = process.env.NEXT_PUBLIC_VENUE_TZ;

beforeAll(() => {
  process.env.NEXT_PUBLIC_VENUE_TZ = "America/New_York";
});

afterAll(() => {
  if (originalEnv) {
    process.env.NEXT_PUBLIC_VENUE_TZ = originalEnv;
  } else {
    delete process.env.NEXT_PUBLIC_VENUE_TZ;
  }
});

describe("formatVenueTime", () => {
  it("should format a DateTime object with default format", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_VENUE_TZ = "America/New_York";

    const { formatVenueTime } = await import("./tz");
    const dateTime = DateTime.fromISO("2025-01-15T10:00:00.000Z");
    const result = formatVenueTime(dateTime);

    expect(result).toBe("Wed, Jan 15, 2025 5:00 AM America/New_York");
  });

  it("should format an ISO string with custom format", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_VENUE_TZ = "America/New_York";

    const { formatVenueTime } = await import("./tz");
    const isoString = "2025-01-15T14:30:00.000Z";
    const result = formatVenueTime(isoString, "MMM d, yyyy 'at' h:mm a");

    expect(result).toBe("Jan 15, 2025 at 9:30 AM");
  });
});

describe("NYC timezone alias", () => {
  it("normalizes NYC to America/New_York", async () => {
    jest.resetModules();
    process.env.NEXT_PUBLIC_VENUE_TZ = "NYC";

    const { formatVenueTime: formatWithAlias } = await import("./tz");
    const result = formatWithAlias("2025-01-15T14:30:00.000Z", "MMM d, yyyy 'at' h:mm a");

    expect(result).toBe("Jan 15, 2025 at 9:30 AM");
  });
});

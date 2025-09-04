import { DateTime } from "luxon";
import { formatVenueTime } from "./tz";

// Mock the environment variable for testing
const originalEnv = process.env.NEXT_PUBLIC_VENUE_TZ;

beforeAll(() => {
  process.env.NEXT_PUBLIC_VENUE_TZ = "Asia/Dubai";
});

afterAll(() => {
  if (originalEnv) {
    process.env.NEXT_PUBLIC_VENUE_TZ = originalEnv;
  } else {
    delete process.env.NEXT_PUBLIC_VENUE_TZ;
  }
});

describe("formatVenueTime", () => {
  it("should format a DateTime object with default format", () => {
    // Create a specific DateTime in UTC
    const dateTime = DateTime.fromISO("2025-01-15T10:00:00.000Z");

    // Format it using the venue timezone
    const result = formatVenueTime(dateTime);

    // Should format to Dubai timezone (UTC+4)
    // Expected: "Wed, Jan 15, 2025 2:00 PM Asia/Dubai" (10:00 UTC + 4 hours = 14:00 Dubai time)
    expect(result).toBe("Wed, Jan 15, 2025 2:00 PM Asia/Dubai");
  });

  it("should format an ISO string with custom format", () => {
    // Use an ISO string instead of DateTime object
    const isoString = "2025-01-15T14:30:00.000Z";

    // Format with custom format
    const result = formatVenueTime(isoString, "MMM d, yyyy 'at' h:mm a");

    // Should format to Dubai timezone (UTC+4)
    // Expected: "Jan 15, 2025 at 6:30 PM" (14:30 UTC + 4 hours = 18:30 Dubai time)
    expect(result).toBe("Jan 15, 2025 at 6:30 PM");
  });
});

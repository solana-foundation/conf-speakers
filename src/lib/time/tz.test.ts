import { DateTime } from "luxon";
import { formatVenueTime, normalizeVenueTimezone } from "./tz";

describe("formatVenueTime", () => {
  it("formats a DateTime in the configured venue timezone", () => {
    const dateTime = DateTime.fromISO("2025-01-15T10:00:00.000Z");
    expect(formatVenueTime(dateTime)).toBe("Wed, Jan 15, 2025 10:00 AM Europe/London");
  });

  it("formats an ISO string with a custom format", () => {
    expect(formatVenueTime("2025-01-15T14:30:00.000Z", "MMM d, yyyy 'at' h:mm a")).toBe("Jan 15, 2025 at 2:30 PM");
  });
});

describe("timezone aliases", () => {
  it("normalizes NYC to America/New_York", () => {
    expect(normalizeVenueTimezone("NYC")).toBe("America/New_York");
  });
});

import { getSessionsFilters } from "./utils";
import { Session, StageValues } from "./types";

describe("getSessionsFilters", () => {
  test("should extract unique stages and dates from sessions", () => {
    const sessions: Session[] = [
      {
        id: "session-1",
        name: "Building Scalable Web Applications",
        description: "Learn how to build web applications that can handle millions of users.",
        startTime: "2025-01-15T10:00:00.000Z",
        endTime: "2025-01-15T11:00:00.000Z",
        stage: StageValues.Main,
        speakerIds: ["speaker-1"],
        moderatorIds: undefined,
        format: undefined,
        actionsDeckReceived: undefined,
        portalTelegramGroup: undefined,
        greenlightTime: undefined,
        webPublishingStatus: undefined,
      },
      {
        id: "session-2",
        name: "Advanced React Patterns",
        description: "Deep dive into advanced React patterns and best practices.",
        startTime: "2025-01-15T14:00:00.000Z",
        endTime: "2025-01-15T15:00:00.000Z",
        stage: StageValues.Side,
        speakerIds: ["speaker-2"],
        moderatorIds: undefined,
        format: undefined,
        actionsDeckReceived: undefined,
        portalTelegramGroup: undefined,
        greenlightTime: undefined,
        webPublishingStatus: undefined,
      },
      {
        id: "session-3",
        name: "Another Session on Main",
        description: "Another session on the same stage.",
        startTime: "2025-01-16T09:00:00.000Z",
        endTime: "2025-01-16T10:00:00.000Z",
        stage: StageValues.Main, // Duplicate stage
        speakerIds: ["speaker-3"],
        moderatorIds: undefined,
        format: undefined,
        actionsDeckReceived: undefined,
        portalTelegramGroup: undefined,
        greenlightTime: undefined,
        webPublishingStatus: undefined,
      },
    ];

    const result = getSessionsFilters(sessions);

    expect(result.stages).toEqual(new Set([StageValues.Main, StageValues.Side]));
    expect(result.times).toEqual(new Set(["2025-01-15", "2025-01-16"]));
  });
});

import { getSessionsFilters } from "./utils";
import { Session } from "./types";

describe("getSessionsFilters", () => {
  test("should extract unique stages and dates from sessions", () => {
    const sessions: Session[] = [
      {
        id: "session-1",
        name: "Building Scalable Web Applications",
        description: "Learn how to build web applications that can handle millions of users.",
        startTime: "2025-01-15T10:00:00.000Z",
        endTime: "2025-01-15T11:00:00.000Z",
        stage: "Stage A",
        speakerIds: ["speaker-1"],
      },
      {
        id: "session-2",
        name: "Advanced React Patterns",
        description: "Deep dive into advanced React patterns and best practices.",
        startTime: "2025-01-15T14:00:00.000Z",
        endTime: "2025-01-15T15:00:00.000Z",
        stage: "Stage B",
        speakerIds: ["speaker-2"],
      },
      {
        id: "session-3",
        name: "Another Session on Stage A",
        description: "Another session on the same stage.",
        startTime: "2025-01-16T09:00:00.000Z",
        endTime: "2025-01-16T10:00:00.000Z",
        stage: "Stage A", // Duplicate stage
        speakerIds: ["speaker-3"],
      },
    ];

    const result = getSessionsFilters(sessions);

    expect(result.stages).toEqual(new Set(["Stage A", "Stage B"]));
    expect(result.times).toEqual(new Set(["2025-01-15", "2025-01-16"]));
  });
});

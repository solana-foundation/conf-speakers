import { Speaker, Session } from "@/lib/airtable/types";

// Mock test data for smoke testing
export const mockSpeaker: Speaker = {
  id: "test-speaker-1",
  _name: "Jane Smith",
  firstName: "Jane",
  lastName: "Smith",
  jobTitle: "Senior Developer",
  company: "Tech Corp",
  bio: "Jane is a passionate developer with 10+ years of experience in web technologies.",
  imageUrl: "https://example.com/jane-smith.jpg",
  xLink: "https://x.com/janesmith",
  xName: "@janesmith",
};

export const mockSessions: Session[] = [
  {
    id: "session-1",
    name: "Building Scalable Web Applications",
    description: "Learn how to build web applications that can handle millions of users.",
    startTime: "2025-01-15T10:00:00.000Z",
    endTime: "2025-01-15T11:00:00.000Z",
    stage: "Absolute Cinema",
    speakerIds: ["test-speaker-1"],
  },
  {
    id: "session-2",
    name: "Advanced React Patterns",
    description: "Deep dive into advanced React patterns and best practices.",
    startTime: "2025-01-15T14:00:00.000Z",
    endTime: "2025-01-15T15:00:00.000Z",
    stage: "Lock In",
    speakerIds: ["test-speaker-1"],
  },
];

// Mock Airtable records (raw format)
export const mockSpeakerRecord = {
  id: "test-speaker-1",
  fields: {
    Name: "Jane Smith",
    "First Name": "Jane",
    "Last Name": "Smith",
    "Role or Title": "Senior Developer",
    Company: "Tech Corp",
    Bio: "Jane is a passionate developer with 10+ years of experience in web technologies.",
    "Headshot_For Web": [{ url: "https://example.com/jane-smith.jpg" }],
    Twitter: "https://x.com/janesmith",
  },
};

export const mockSessionRecords = [
  {
    id: "session-1",
    fields: {
      "⚙️ Session Name": "Building Scalable Web Applications",
      Description: "Learn how to build web applications that can handle millions of users.",
      "Start Time": "2025-01-15T10:00:00.000Z",
      "End Time": "2025-01-15T11:00:00.000Z",
      Stage: "Stage A",
      Speakers: ["Jane Smith"],
    },
  },
  {
    id: "session-2",
    fields: {
      "⚙️ Session Name": "Advanced React Patterns",
      Description: "Deep dive into advanced React patterns and best practices.",
      "Start Time": "2025-01-15T14:00:00.000Z",
      "End Time": "2025-01-15T15:00:00.000Z",
      Stage: "Stage B",
      Speakers: ["Jane Smith"],
    },
  },
];

// Test authentication key
export const testAuthKey = "test-secret-key";

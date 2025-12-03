import { Speaker, Session, StageValues } from "@/lib/airtable/types";

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
  speakerCardUrl: "https://example.com/jane-smith-card.jpg",
  xLink: "https://x.com/janesmith",
  xName: "@janesmith",
  slideDeckFile: undefined,
  lumaTicketSpeaker: undefined,
  lumaTicketPlusOne: undefined,
  invitationCode: undefined,
  discountCode: undefined,
  dietary: undefined,
  speakerPermitApproval: undefined,
  mcInfo: undefined,
};

export const mockSessions: Session[] = [
  {
    id: "session-1",
    name: "Building Scalable Web Applications",
    description: "Learn how to build web applications that can handle millions of users.",
    startTime: "2025-01-15T10:00:00.000Z",
    endTime: "2025-01-15T11:00:00.000Z",
    stage: StageValues.Main,
    speakerIds: ["test-speaker-1"],
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
    speakerIds: ["test-speaker-1"],
    moderatorIds: undefined,
    format: undefined,
    actionsDeckReceived: undefined,
    portalTelegramGroup: undefined,
    greenlightTime: undefined,
    webPublishingStatus: undefined,
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
    "Speaker Card": [{ url: "https://example.com/jane-smith-card.jpg" }],
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
      Stage: StageValues.Main,
      "Onboarded Speakers": ["Jane Smith"],
    },
  },
  {
    id: "session-2",
    fields: {
      "⚙️ Session Name": "Advanced React Patterns",
      Description: "Deep dive into advanced React patterns and best practices.",
      "Start Time": "2025-01-15T14:00:00.000Z",
      "End Time": "2025-01-15T15:00:00.000Z",
      Stage: StageValues.Side,
      "Onboarded Speakers": ["Jane Smith"],
    },
  },
];

// Test authentication key
export const testAuthKey = "test-secret-key";

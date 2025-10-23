import { unstable_cache } from "next/cache";
import { airtable } from "./client";

const tableSessions = process.env.AIRTABLE_TABLE_AGENDA;
const tableSpeakers = process.env.AIRTABLE_TABLE_SPEAKERS;
const tableFormats = process.env.AIRTABLE_TABLE_FORMATS;
const REVALIDATE_TIME = 1800; // 30 minutes

if (!tableSessions || !tableSpeakers || !tableFormats) {
  throw new Error("AIRTABLE_TABLE_AGENDA or AIRTABLE_TABLE_SPEAKERS or AIRTABLE_TABLE_FORMATS is not set");
}

interface SessionParams {
  speakerName?: string;
}

export const fetchSessions = (params: SessionParams = {}) => {
  return airtable
    .table(tableSessions)
    .select({
      fields: [
        "⚙️ Session Name",
        "Description",
        "Start Time",
        "End Time",
        "Stage",
        "Speakers",
        "Moderator",
        "Format",
        "Web Publishing Status",
      ],
      ...(params.speakerName ? { filterByFormula: `FIND("${params.speakerName}", {Speakers}&"")` } : undefined),
      sort: [{ field: "Start Time", direction: "asc" }],
    })
    .all();
};

export const fetchSession = (sessionId: string) => {
  return airtable.table(tableSessions).find(sessionId);
};

export const fetchSpeaker = (speakerId: string) => {
  return airtable.table(tableSpeakers).find(speakerId);
};

export const fetchSpeakers = () => {
  return airtable
    .table(tableSpeakers)
    .select({
      fields: [
        "Name",
        "First Name",
        "Last Name",
        "Role or Title",
        "Company",
        "Bio",
        "Headshot_For Web",
        "Twitter",
        "Luma Ticket_Speaker",
        "Luma Ticket_Plus One",
        "Invitation Code",
        "Slide Deck File",
        "Slide Deck File_String",
      ],
      sort: [{ field: "Name", direction: "asc" }],
    })
    .all();
};

export const fetchFormats = () => {
  return airtable
    .table(tableFormats)
    .select({
      fields: ["Format"],
    })
    .all();
};

export const getCachedSessions = unstable_cache(
  async (params: SessionParams = {}) => {
    return await fetchSessions(params);
  },
  ["sessions"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["sessions"],
  },
);

export const getCachedSpeaker = unstable_cache(
  async (speakerId: string) => {
    return await fetchSpeaker(speakerId);
  },
  ["speaker"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["speaker"],
  },
);

export const getCachedFormats = unstable_cache(
  async () => {
    return await fetchFormats();
  },
  ["formats"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["formats"],
  },
);

export const getCachedSpeakers = unstable_cache(
  async () => {
    return await fetchSpeakers();
  },
  ["speakers"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["speakers"],
  },
);

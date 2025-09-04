import { unstable_cache } from "next/cache";
import { airtable } from "./client";

const tableSessions = process.env.AIRTABLE_TABLE_AGENDA;
const tableSpeakers = process.env.AIRTABLE_TABLE_SPEAKERS;

if (!tableSessions || !tableSpeakers) {
  throw new Error("AIRTABLE_TABLE_AGENDA or AIRTABLE_TABLE_SPEAKERS is not set");
}

interface SessionParams {
  speakerName?: string;
}

export const fetchSessions = (params: SessionParams = {}) => {
  return airtable
    .table(tableSessions)
    .select({
      fields: ["⚙️ Session Name", "Description", "Start Time", "End Time", "Stage"],
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

export const getCachedSessions = unstable_cache(
  async (params: SessionParams = {}) => {
    return await fetchSessions(params);
  },
  ["sessions"],
  {
    revalidate: 1800, // 30 minutes
    tags: ["sessions"],
  },
);

export const getCachedSpeaker = unstable_cache(
  async (speakerId: string) => {
    return await fetchSpeaker(speakerId);
  },
  ["speaker"],
  {
    revalidate: 1800, // 30 minutes
    tags: ["speaker"],
  },
);

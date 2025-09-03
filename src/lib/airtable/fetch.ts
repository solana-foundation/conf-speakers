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

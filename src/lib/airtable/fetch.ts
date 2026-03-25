import { unstable_cache } from "next/cache";
import { airtable } from "./client";
import { airtableTableIds } from "./config";

const tableSessions = airtableTableIds.sessions;
const tableSpeakers = airtableTableIds.speakers;
const tableFormats = airtableTableIds.formats;
const REVALIDATE_TIME = 300; // 5 minutes
const DATA_CACHING_OFF = process.env.DATA_CACHING_OFF === "true";

if (!tableSessions || !tableSpeakers || !tableFormats) {
  throw new Error("AIRTABLE_TABLE_AGENDA or AIRTABLE_TABLE_SPEAKERS or AIRTABLE_TABLE_FORMATS is not set");
}

const normalizeAirtableError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (error && typeof error === "object") {
    const maybeError = error as { error?: string; message?: string; statusCode?: number };
    const details = [maybeError.error, maybeError.message, maybeError.statusCode].filter(Boolean).join(" | ");
    return new Error(details || "Unknown Airtable error");
  }

  return new Error(String(error));
};

const runAirtableRequest = async <T>(request: Promise<T>): Promise<T> => {
  try {
    return await request;
  } catch (error) {
    throw normalizeAirtableError(error);
  }
};

export const fetchSessions = () => {
  return runAirtableRequest(
    airtable
      .table(tableSessions)
      .select({
        sort: [{ field: "Start Time", direction: "asc" }],
      })
      .all(),
  );
};

export const fetchSession = (sessionId: string) => {
  return runAirtableRequest(airtable.table(tableSessions).find(sessionId));
};

export const fetchSpeaker = (speakerId: string) => {
  return runAirtableRequest(airtable.table(tableSpeakers).find(speakerId));
};

export const fetchSpeakers = () => {
  return runAirtableRequest(
    airtable
      .table(tableSpeakers)
      .select({
        sort: [{ field: "Name", direction: "asc" }],
      })
      .all(),
  );
};

export const fetchFormats = () => {
  return runAirtableRequest(airtable.table(tableFormats).select().all());
};

const cachedSessions = unstable_cache(
  async () => {
    return await fetchSessions();
  },
  ["sessions"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["sessions"],
  },
);

const cachedSpeaker = unstable_cache(
  async (speakerId: string) => {
    return await fetchSpeaker(speakerId);
  },
  ["speaker"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["speaker"],
  },
);

const cachedFormats = unstable_cache(
  async () => {
    return await fetchFormats();
  },
  ["formats"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["formats"],
  },
);

const cachedSpeakers = unstable_cache(
  async () => {
    return await fetchSpeakers();
  },
  ["speakers"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["speakers"],
  },
);

export const getCachedSessions = async () => {
  return DATA_CACHING_OFF ? fetchSessions() : cachedSessions();
};

export const getCachedSpeaker = async (speakerId: string) => {
  return DATA_CACHING_OFF ? fetchSpeaker(speakerId) : cachedSpeaker(speakerId);
};

export const getCachedFormats = async () => {
  return DATA_CACHING_OFF ? fetchFormats() : cachedFormats();
};

export const getCachedSpeakers = async () => {
  return DATA_CACHING_OFF ? fetchSpeakers() : cachedSpeakers();
};

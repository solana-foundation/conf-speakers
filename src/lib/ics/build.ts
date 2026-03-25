import { createEvents, EventAttributes } from "ics";
import { parseISO } from "@/lib/time/tz";
import { CALENDAR_NAME, EVENT_NAME, EVENT_LOCATION, ORGANIZER_EMAIL, ORGANIZER_NAME, SITE_HOST } from "@/lib/site";
import { normalizeStageTitle } from "@/lib/airtable/stages";

const DEFAULT_ICS_LOCATION = EVENT_LOCATION;
const DEFAULT_ICS_GEO =
  process.env.EVENT_GEO_LAT && process.env.EVENT_GEO_LON
    ? { lat: Number(process.env.EVENT_GEO_LAT), lon: Number(process.env.EVENT_GEO_LON) }
    : undefined;

export interface SessionEvent {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  stage?: string;
  organizer?: { name: string; email: string };
}

export interface SpeakerEvent extends SessionEvent {
  speakerName?: string;
}

/**
 * Convert a session to an ICS event
 */
export function sessionToIcsEvent(session: SessionEvent): EventAttributes {
  const start = parseISO(session.startTime);
  const end = parseISO(session.endTime);
  const created = new Date();

  if (!start.isValid || !end.isValid) {
    throw new Error(`Invalid date format for session ${session.id}`);
  }

  // Convert to UTC for proper timezone handling in ICS
  const startUtc = start.toUTC();
  const endUtc = end.toUTC();

  const startArray = [startUtc.year, startUtc.month, startUtc.day, startUtc.hour, startUtc.minute] as [
    number,
    number,
    number,
    number,
    number,
  ];

  const endArray = [endUtc.year, endUtc.month, endUtc.day, endUtc.hour, endUtc.minute] as [
    number,
    number,
    number,
    number,
    number,
  ];

  const createdArray = [created.getFullYear(), created.getMonth() + 1, created.getDate()] as [number, number, number];

  const description = [session.description].filter(Boolean).join("\n\n");
  const stageTitle = normalizeStageTitle(session.stage);

  return {
    start: startArray,
    startInputType: "utc" as const,
    startOutputType: "utc" as const,
    end: endArray,
    endInputType: "utc" as const,
    endOutputType: "utc" as const,
    title: session.name,
    description,
    location:
      stageTitle && DEFAULT_ICS_LOCATION
        ? `${stageTitle}, ${DEFAULT_ICS_LOCATION}`
        : stageTitle || DEFAULT_ICS_LOCATION || undefined,
    geo: DEFAULT_ICS_GEO,
    uid: `session-${session.id}@${SITE_HOST}`,
    productId: `${SITE_HOST}//${CALENDAR_NAME}//EN`,
    calName: CALENDAR_NAME,
    organizer: { name: ORGANIZER_NAME, email: ORGANIZER_EMAIL },
    status: "CONFIRMED" as const,
    busyStatus: "BUSY" as const,
    created: createdArray,
    lastModified: createdArray,
  };
}

/**
 * Convert a speaker's sessions to ICS events
 */
export function speakerSessionsToIcsEvents(sessions: SpeakerEvent[]) {
  return sessions.map((session) => {
    const event = sessionToIcsEvent(session);

    // Add speaker name to title if available
    if (session.speakerName) {
      event.title = `${session.name} - ${session.speakerName}`;
    } else if (EVENT_NAME) {
      event.title = session.name;
    }

    return event;
  });
}

/**
 * Generate ICS content for sessions
 */
export function generateIcsContent(sessions: SessionEvent[]): string {
  const events = sessions.map(sessionToIcsEvent);

  const { error, value } = createEvents(events);

  if (error) {
    throw new Error(`Failed to generate ICS: ${error.message}`);
  }

  return value || "";
}

/**
 * Generate ICS content for a speaker's sessions
 */
export function generateSpeakerIcsContent(sessions: SpeakerEvent[]): string {
  const events = speakerSessionsToIcsEvents(sessions);

  const { error, value } = createEvents(events);

  if (error) {
    throw new Error(`Failed to generate ICS: ${error.message}`);
  }

  return value || "";
}

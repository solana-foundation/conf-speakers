import { createEvents, EventAttributes } from "ics";
import { parseISO } from "@/lib/time/tz";

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

  return {
    start: startArray,
    startInputType: "utc" as const,
    startOutputType: "utc" as const,
    end: endArray,
    endInputType: "utc" as const,
    endOutputType: "utc" as const,
    title: `BP25 - ${session.name}`,
    description,
    location: session.stage ? session.stage : "Etihad Arena, Abu Dhabi, UAE",
    geo: { lat: 24.4539, lon: 54.3773 }, // Abu Dhabi coordinates
    uid: `session-${session.id}@speakers.solana.com`,
    productId: "speakers.solana.com//Breakpoint 2025//EN",
    calName: "Breakpoint 2025",
    organizer: { name: "Breakpoint 2025", email: "noreply@speakers.solana.com" },
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
      event.title = `Breakpoint 2025 - ${session.name} - ${session.speakerName}`;
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

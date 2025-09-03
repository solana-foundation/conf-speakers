import { createEvents } from "ics";
import { parseISO } from "@/lib/time/tz";

export interface SessionEvent {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  stage?: string;
}

export interface SpeakerEvent extends SessionEvent {
  speakerName?: string;
}

/**
 * Convert a session to an ICS event
 */
export function sessionToIcsEvent(session: SessionEvent) {
  const start = parseISO(session.startTime);
  const end = parseISO(session.endTime);

  if (!start.isValid || !end.isValid) {
    throw new Error(`Invalid date format for session ${session.id}`);
  }

  const startArray = [start.year, start.month, start.day, start.hour, start.minute] as [
    number,
    number,
    number,
    number,
    number,
  ];

  const endArray = [end.year, end.month, end.day, end.hour, end.minute] as [number, number, number, number, number];

  const description = [session.description].filter(Boolean).join("\n\n");

  return {
    start: startArray,
    end: endArray,
    title: `Breakpoint 2025 - ${session.name}`,
    description,
    location: session.stage,
    uid: `session-${session.id}@speakers.solana.com`,
    productId: "speakers.solana.com//Breakpoint 2025//EN",
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

import { z } from "zod";
import { Session, WEB_PUBLISHING_STATUS_MAP } from "./types";

export const getZodErrorMessage = (error: z.ZodError) => {
  return error.issues.map(({ message, path }) => `${message} - ${path.join(".")}`).join(", ");
};

export interface WebPublishingStatus {
  hasTime: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  hasSpeaker: boolean;
  hasDoNotPublish: boolean;
}

export const getWebPublishingStatus = (webPublishingStatus?: string[]): WebPublishingStatus | null => {
  if (!webPublishingStatus || webPublishingStatus.length === 0) {
    return null;
  }

  const flags = webPublishingStatus.map((id) => WEB_PUBLISHING_STATUS_MAP[id]).filter(Boolean);

  return {
    hasTime: flags.includes("Time"),
    hasTitle: flags.includes("Title"),
    hasDescription: flags.includes("Description"),
    hasSpeaker: flags.includes("Speaker"),
    hasDoNotPublish: flags.includes("Do not publish"),
  };
};

export const isZodError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};

export const getSessionsFilters = (sessions: Session[]) => {
  const sets = {
    stages: new Set<string>(),
    times: new Set<string>(),
  };

  sessions.forEach((session) => {
    if (session.stage) {
      sets.stages.add(session.stage);
    }

    if (session.startTime) {
      sets.times.add(session.startTime.split("T")[0]);
    }
  });

  return sets;
};

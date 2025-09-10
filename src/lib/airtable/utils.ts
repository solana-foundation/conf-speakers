import { z } from "zod";
import { Session } from "./types";

export const getZodErrorMessage = (error: z.ZodError) => {
  return error.issues.map(({ message, path }) => `${message} - ${path.join(".")}`).join(", ");
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

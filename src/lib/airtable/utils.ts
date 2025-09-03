import { z } from "zod";

export const getZodErrorMessage = (error: z.ZodError) => {
  return error.issues.map(({ message, path }) => `${message} - ${path.join(".")}`).join(", ");
};

export const isZodError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};

import { z } from "zod";
import { sanitizeXLink, sanitizeXName } from "@/lib/utils";

export const SessionFieldsSchema = z
  .object({
    "⚙️ Session Name": z.string(),
    Description: z.string().optional(),
    "Start Time": z.string().optional(),
    "End Time": z.string().optional(),
    Stage: z.string(),
  })
  .transform((data) => ({
    name: data["⚙️ Session Name"],
    description: data["Description"],
    startTime: data["Start Time"],
    endTime: data["End Time"],
    stage: data["Stage"],
  }));

export const SpeakerFieldsSchema = z
  .object({
    Name: z.string(),
    "First Name": z.string(),
    "Last Name": z.string(),
    "Role or Title": z.string().optional(),
    Company: z.string().optional(),
    Bio: z.string().optional(),
    "Headshot_For Web": z
      .array(
        z
          .object({
            url: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    Twitter: z.string().optional(),
  })
  .transform((data) => ({
    _name: data["Name"],
    firstName: data["First Name"],
    lastName: data["Last Name"],
    jobTitle: data["Role or Title"],
    company: data.Company,
    bio: data.Bio,
    imageUrl: data["Headshot_For Web"]?.[0]?.url,
    xLink: data.Twitter ? (sanitizeXLink(data.Twitter) ?? undefined) : undefined,
    xName: data.Twitter ? (sanitizeXName(data.Twitter) ?? undefined) : undefined,
  }));

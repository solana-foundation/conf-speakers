import { z } from "zod";
import { sanitizeXLink, sanitizeXName } from "@/lib/utils";

export const SessionFieldsSchema = z
  .object({
    id: z.string(),
    fields: z.object({
      "⚙️ Session Name": z.string(),
      Description: z.string().optional(),
      "Start Time": z.string().optional(),
      "End Time": z.string().optional(),
      Stage: z.string(),
      Speakers: z.array(z.string()).optional(),
    }),
  })
  .transform((data) => ({
    id: data.id,
    name: data.fields["⚙️ Session Name"],
    description: data.fields["Description"],
    startTime: data.fields["Start Time"],
    endTime: data.fields["End Time"],
    stage: data.fields["Stage"],
    speakerIds: data.fields["Speakers"],
  }));

export const SpeakerFieldsSchema = z
  .object({
    id: z.string(),
    fields: z.object({
      Name: z.string().optional(),
      "First Name": z.string().optional(),
      "Last Name": z.string().optional(),
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
    }),
  })
  .transform((data) => ({
    id: data.id,
    _name: data.fields["Name"],
    firstName: data.fields["First Name"],
    lastName: data.fields["Last Name"],
    jobTitle: data.fields["Role or Title"],
    company: data.fields["Company"],
    bio: data.fields["Bio"],
    imageUrl: data.fields["Headshot_For Web"]?.[0]?.url,
    xLink: data.fields["Twitter"] ? (sanitizeXLink(data.fields["Twitter"]) ?? undefined) : undefined,
    xName: data.fields["Twitter"] ? (sanitizeXName(data.fields["Twitter"]) ?? undefined) : undefined,
  }));

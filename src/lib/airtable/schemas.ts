import { z } from "zod";
import { sanitizeXLink, sanitizeXName } from "@/lib/utils";
import { StageValues } from "@/lib/airtable/types";

export const SessionFieldsSchema = z
  .object({
    id: z.string(),
    fields: z.object({
      "⚙️ Session Name": z.string(),
      Description: z.string().optional(),
      "Start Time": z.string().optional(),
      "End Time": z.string().optional(),
      Stage: z.enum(Object.values(StageValues)),
      Speakers: z.array(z.string()).optional(),
      Moderator: z.array(z.string()).optional(),
      Format: z.array(z.string()).optional(),
      "Actions_Deck Received": z.string().optional(),
      "Portal_Telegram Group": z.string().optional(),
      "Portal_Greenlight Time": z.string().optional(),
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
    moderatorIds: data.fields["Moderator"],
    format: data.fields["Format"],
    actionsDeckReceived: data.fields["Actions_Deck Received"],
    portalTelegramGroup: data.fields["Portal_Telegram Group"],
    greenlightTime: data.fields["Portal_Greenlight Time"],
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
      "Luma Ticket_Speaker": z.string().optional(),
      "Luma Ticket_Plus One": z.string().optional(),
      "Invitation Code": z.string().optional(),
      "Slide Deck File": z
        .array(
          z
            .object({
              url: z.string().optional(),
            })
            .optional(),
        )
        .optional(),
      "Slide Deck File_String": z.string().optional(),
      Dietary: z.string().optional(),
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
    lumaTicketSpeaker: data.fields["Luma Ticket_Speaker"],
    lumaTicketPlusOne: data.fields["Luma Ticket_Plus One"],
    invitationCode: data.fields["Invitation Code"],
    slideDeckUrl: data.fields["Slide Deck File"]?.[0]?.url || data.fields["Slide Deck File_String"],
    dietary: data.fields["Dietary"],
  }));

export const FormatFieldsSchema = z
  .object({
    id: z.string(),
    fields: z.object({
      "Format Label": z.string(),
    }),
  })
  .transform((data) => ({
    id: data.id,
    label: data.fields["Format Label"],
  }));

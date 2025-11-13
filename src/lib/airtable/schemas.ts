import { z } from "zod";
import { sanitizeXLink, sanitizeXName } from "@/lib/utils";
import { StageValues, DeckStatus } from "@/lib/airtable/types";

export const SessionFieldsSchema = z
  .object({
    id: z.string(),
    fields: z.object({
      "⚙️ Session Name": z.string().optional(),
      Description: z.string().optional(),
      "Start Time": z.string().optional(),
      "End Time": z.string().optional(),
      Stage: z.union([z.enum(Object.values(StageValues)), z.array(z.enum(Object.values(StageValues)))]).optional(),
      Speakers: z.array(z.string()).optional(),
      Moderator: z.array(z.string()).optional(),
      Format: z.array(z.string()).optional(),
      "Actions_Deck Received": z
        .union([z.enum([DeckStatus.ToUpload, DeckStatus.Uploaded, DeckStatus.Approved]), z.null()])
        .optional(),
      "Portal_Telegram Group": z.string().optional(),
      "Portal_Greenlight Time": z.string().optional(),
      "Web Publishing Status": z.array(z.string()).optional(),
      "Publish to web": z.boolean().optional(),
    }),
  })
  .transform((data) => ({
    id: data.id,
    name: data.fields["⚙️ Session Name"],
    description: data.fields["Description"],
    startTime: data.fields["Start Time"],
    endTime: data.fields["End Time"],
    stage: Array.isArray(data.fields["Stage"]) ? data.fields["Stage"][0] : data.fields["Stage"],
    speakerIds: data.fields["Speakers"],
    moderatorIds: data.fields["Moderator"],
    format: data.fields["Format"],
    actionsDeckReceived: data.fields["Actions_Deck Received"],
    portalTelegramGroup: data.fields["Portal_Telegram Group"],
    greenlightTime: data.fields["Portal_Greenlight Time"],
    webPublishingStatus: data.fields["Web Publishing Status"],
    publishToWeb: data.fields["Publish to web"],
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
      "Slide Deck File": z.string().optional(),
      "Luma Ticket_Speaker": z.string().optional(),
      "Luma Ticket_Plus One": z.string().optional(),
      "Invitation Code": z.string().optional(),
      Dietary: z.string().optional(),
      "Speaker Permit Approval": z.string().optional(),
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
    slideDeckFile: data.fields["Slide Deck File"],
    lumaTicketSpeaker: data.fields["Luma Ticket_Speaker"],
    lumaTicketPlusOne: data.fields["Luma Ticket_Plus One"],
    invitationCode: data.fields["Invitation Code"],
    dietary: data.fields["Dietary"],
    speakerPermitApproval: data.fields["Speaker Permit Approval"],
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

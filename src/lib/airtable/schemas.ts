import { z } from "zod";
import { sanitizeXLink, sanitizeXName } from "@/lib/utils";
import { StageValues, DeckStatus } from "@/lib/airtable/types";

// Define field schemas separately so we can extract field names
const sessionFieldsSchema = z.object({
  "⚙️ Session Name": z.string().optional(),
  Description: z.string().optional(),
  "Start Time": z.string().optional(),
  "End Time": z.string().optional(),
  Stage: z.union([z.enum(Object.values(StageValues)), z.array(z.enum(Object.values(StageValues)))]).optional(),
  "Onboarded Speakers": z.array(z.string()).optional(),
  Moderator: z.array(z.string()).optional(),
  Format: z.array(z.string()).optional(),
  "Actions_Deck Received": z
    .union([z.enum([DeckStatus.ToUpload, DeckStatus.Uploaded, DeckStatus.Approved]), z.null()])
    .optional(),
  "Portal_Telegram Group": z.string().optional(),
  "Portal_Greenlight Time": z.string().optional(),
  "Web Publishing Status": z.array(z.string()).optional(),
});

const speakerFieldsSchema = z.object({
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
  "Speaker Card": z
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
  "Luma Speaker Ticket": z.string().optional(),
  "Luma Ticket_Plus One": z.string().optional(),
  "Invitation Code": z.string().optional(),
  "25% Discount Code": z.string().optional(),
  Dietary: z.string().optional(),
  "Speaker Permit Approval": z.string().optional(),
  "MC Info": z.string().optional(),
  "Parking Ticket": z.string().optional(),
});

const formatFieldsSchema = z.object({
  Format: z.string(),
});

// Export field names arrays for use in fetch functions
export const sessionFieldNames = Object.keys(sessionFieldsSchema.shape);
export const speakerFieldNames = Object.keys(speakerFieldsSchema.shape);
export const formatFieldNames = Object.keys(formatFieldsSchema.shape);

export const SessionFieldsSchema = z
  .object({
    id: z.string(),
    fields: sessionFieldsSchema,
  })
  .transform((data) => ({
    id: data.id,
    name: data.fields["⚙️ Session Name"],
    description: data.fields["Description"],
    startTime: data.fields["Start Time"],
    endTime: data.fields["End Time"],
    stage: Array.isArray(data.fields["Stage"]) ? data.fields["Stage"][0] : data.fields["Stage"],
    speakerIds: data.fields["Onboarded Speakers"],
    moderatorIds: data.fields["Moderator"],
    format: data.fields["Format"],
    actionsDeckReceived: data.fields["Actions_Deck Received"],
    portalTelegramGroup: data.fields["Portal_Telegram Group"],
    greenlightTime: data.fields["Portal_Greenlight Time"],
    webPublishingStatus: data.fields["Web Publishing Status"],
  }));

export const SpeakerFieldsSchema = z
  .object({
    id: z.string(),
    fields: speakerFieldsSchema,
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
    speakerCardUrl: data.fields["Speaker Card"]?.[0]?.url,
    xLink: data.fields["Twitter"] ? (sanitizeXLink(data.fields["Twitter"]) ?? undefined) : undefined,
    xName: data.fields["Twitter"] ? (sanitizeXName(data.fields["Twitter"]) ?? undefined) : undefined,
    slideDeckFile: data.fields["Slide Deck File"],
    lumaTicketSpeaker: data.fields["Luma Speaker Ticket"],
    lumaTicketPlusOne: data.fields["Luma Ticket_Plus One"],
    invitationCode: data.fields["Invitation Code"],
    discountCode: data.fields["25% Discount Code"],
    dietary: data.fields["Dietary"],
    speakerPermitApproval: data.fields["Speaker Permit Approval"],
    mcInfo: data.fields["MC Info"],
    parkingTicket: data.fields["Parking Ticket"],
  }));

export const FormatFieldsSchema = z
  .object({
    id: z.string(),
    fields: formatFieldsSchema,
  })
  .transform((data) => ({
    id: data.id,
    label: data.fields["Format"],
  }));

// Export inferred types from schemas
export type Session = z.output<typeof SessionFieldsSchema>;
export type Speaker = z.output<typeof SpeakerFieldsSchema>;
export type Format = z.output<typeof FormatFieldsSchema>;

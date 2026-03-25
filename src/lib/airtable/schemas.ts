import { z } from "zod";
import { sanitizeXLink, sanitizeXName } from "@/lib/utils";
import { airtableFieldMap, getFieldAliases } from "./config";

const AirtableRecordSchema = z.object({
  id: z.string(),
  fields: z.record(z.string(), z.unknown()),
});

type AirtableFields = z.infer<typeof AirtableRecordSchema>["fields"];

const getFieldValue = (fields: AirtableFields, aliases: readonly string[]) => {
  for (const alias of aliases) {
    if (alias in fields) {
      return fields[alias];
    }
  }

  return undefined;
};

const getStringField = (fields: AirtableFields, aliases: readonly string[]) => {
  const value = getFieldValue(fields, aliases);
  return typeof value === "string" ? value : undefined;
};

const getStringArrayField = (fields: AirtableFields, aliases: readonly string[]) => {
  const value = getFieldValue(fields, aliases);

  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
};

const getBooleanField = (fields: AirtableFields, aliases: readonly string[]) => {
  const value = getFieldValue(fields, aliases);
  return typeof value === "boolean" ? value : undefined;
};

const getFirstAttachmentUrl = (fields: AirtableFields, aliases: readonly string[]) => {
  const value = getFieldValue(fields, aliases);

  if (!Array.isArray(value)) {
    return undefined;
  }

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const url = (item as { url?: unknown }).url;
    if (typeof url === "string") {
      return url;
    }
  }

  return undefined;
};

export const SessionFieldsSchema = z
  .object(AirtableRecordSchema.shape)
  .transform((data) => ({
    id: data.id,
    name: getStringField(data.fields, getFieldAliases("session", "name")),
    description: getStringField(data.fields, getFieldAliases("session", "description")),
    startTime: getStringField(data.fields, getFieldAliases("session", "startTime")),
    endTime: getStringField(data.fields, getFieldAliases("session", "endTime")),
    stage: getStringField(data.fields, getFieldAliases("session", "stage")),
    speakerIds: getStringArrayField(data.fields, getFieldAliases("session", "speakerIds")),
    moderatorIds: getStringArrayField(data.fields, getFieldAliases("session", "moderatorIds")),
    format: getStringArrayField(data.fields, getFieldAliases("session", "formatIds")),
    actionsDeckReceived: getStringField(data.fields, getFieldAliases("session", "actionsDeckReceived")),
    portalTelegramGroup: getStringField(data.fields, getFieldAliases("session", "portalTelegramGroup")),
    greenlightTime: getStringField(data.fields, getFieldAliases("session", "greenlightTime")),
    webPublishingStatus: getStringArrayField(data.fields, getFieldAliases("session", "webPublishingStatus")),
  }));

export const SpeakerFieldsSchema = z
  .object(AirtableRecordSchema.shape)
  .transform((data) => ({
    id: data.id,
    _name: getStringField(data.fields, getFieldAliases("speaker", "name")),
    firstName: getStringField(data.fields, getFieldAliases("speaker", "firstName")),
    lastName: getStringField(data.fields, getFieldAliases("speaker", "lastName")),
    jobTitle: getStringField(data.fields, getFieldAliases("speaker", "jobTitle")),
    company: getStringField(data.fields, getFieldAliases("speaker", "company")),
    bio: getStringField(data.fields, getFieldAliases("speaker", "bio")),
    imageUrl: getFirstAttachmentUrl(data.fields, getFieldAliases("speaker", "image")),
    speakerCardUrl: getFirstAttachmentUrl(data.fields, getFieldAliases("speaker", "speakerCard")),
    xLink: getStringField(data.fields, getFieldAliases("speaker", "twitter"))
      ? (sanitizeXLink(getStringField(data.fields, getFieldAliases("speaker", "twitter"))!) ?? undefined)
      : undefined,
    xName: getStringField(data.fields, getFieldAliases("speaker", "twitter"))
      ? (sanitizeXName(getStringField(data.fields, getFieldAliases("speaker", "twitter"))!) ?? undefined)
      : undefined,
    slideDeckFile: getStringField(data.fields, getFieldAliases("speaker", "slideDeckFile")),
    lumaTicketSpeaker: getStringField(data.fields, getFieldAliases("speaker", "lumaTicketSpeaker")),
    lumaTicketPlusOne: getStringField(data.fields, getFieldAliases("speaker", "lumaTicketPlusOne")),
    invitationCode: getStringField(data.fields, getFieldAliases("speaker", "invitationCode")),
    discountCode: getStringField(data.fields, getFieldAliases("speaker", "discountCode")),
    dietary: getStringField(data.fields, getFieldAliases("speaker", "dietary")),
    speakerPermitApproval: getStringField(data.fields, getFieldAliases("speaker", "speakerPermitApproval")),
    mcInfo: getStringField(data.fields, getFieldAliases("speaker", "mcInfo")),
    parkingTicket: getStringField(data.fields, getFieldAliases("speaker", "parkingTicket")),
    youtubeVideoUrl: getStringField(data.fields, getFieldAliases("speaker", "youtubeVideoUrl")),
    speakerPhotoLink: getStringField(data.fields, getFieldAliases("speaker", "speakerPhotoLink")),
    actionsDeckReceived: getStringField(data.fields, getFieldAliases("speaker", "actionsDeckReceived")),
    greenlightTime: getStringField(data.fields, getFieldAliases("speaker", "greenlightTime")),
    publishToWeb: getBooleanField(data.fields, getFieldAliases("speaker", "publishToWeb")),
  }));

export const FormatFieldsSchema = z
  .object(AirtableRecordSchema.shape)
  .transform((data) => ({
    id: data.id,
    label: getStringField(data.fields, getFieldAliases("format", "label")),
    durationMinutes: getFieldValue(data.fields, getFieldAliases("format", "durationMinutes")),
  }));

export const parseSessionRecord = (record: unknown) => SessionFieldsSchema.parse(record);
export const parseSpeakerRecord = (record: unknown) => SpeakerFieldsSchema.parse(record);
export const parseFormatRecord = (record: unknown) => FormatFieldsSchema.parse(record);
export const getFormatLabel = (record: unknown) => parseFormatRecord(record).label;
export const getSpeakerDisplayName = (record: unknown) => parseSpeakerRecord(record)._name;

export const getConfiguredAirtableAliases = () => airtableFieldMap;

// Export inferred types from schemas
export type Session = z.output<typeof SessionFieldsSchema>;
export type Speaker = z.output<typeof SpeakerFieldsSchema>;
export type Format = z.output<typeof FormatFieldsSchema>;

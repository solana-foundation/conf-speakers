import { airtableWebPublishingStatusMap } from "./config";

export type StageTitle = "Absolute Cinema" | "Lock In" | "Cafe del Mar" | "Etihad Arena" | "Main Stage" | (string & {});

export enum StageValues {
  Main = "Absolute Cinema",
  Side = "Lock In",
  Cafe = "Cafe del Mar",
  Etihad = "Etihad Arena",
}

export enum DeckStatus {
  ToUpload = "To Upload Deck",
  Uploaded = "Deck Uploaded, not yet approved",
  Approved = "Deck Approved",
  Completed = "Completed",
}

export const WEB_PUBLISHING_STATUS_MAP: Record<string, string> = airtableWebPublishingStatusMap;

// Re-export types derived from schemas (single source of truth)
export type { Session, Speaker, Format } from "./schemas";

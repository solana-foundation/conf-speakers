import { airtableWebPublishingStatusMap } from "./config";
import { CanonicalStageTitle, LegacyStageTitle } from "./stages";

export type StageTitle = CanonicalStageTitle | LegacyStageTitle | (string & {});

export enum StageValues {
  Main = "Main Stage",
  Side = "Side Stage",
  Cafe = "Lounge Stage",
  Etihad = "Arena Stage",
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

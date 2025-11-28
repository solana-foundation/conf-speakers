export type StageTitle = "Absolute Cinema" | "Lock In";

export enum StageValues {
  Main = "Absolute Cinema",
  Side = "Lock In",
}

export enum DeckStatus {
  ToUpload = "To Upload Deck",
  Uploaded = "Deck Uploaded",
  Approved = "Deck Approved",
}

// Re-export types derived from schemas (single source of truth)
export type { Session, Speaker, Format } from "./schemas";

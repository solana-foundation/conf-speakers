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

export const WEB_PUBLISHING_STATUS_MAP: Record<string, string> = {
  recwtiuTWTluBFNAE: "Time",
  recOn6L12BmGHDOno: "Title",
  recEP0WiwY2y8dx22: "Description",
  recRQY6k9lMzQnFk9: "Speaker",
  recqpel3kBGWP6Xkx: "Do not publish",
};

// Re-export types derived from schemas (single source of truth)
export type { Session, Speaker, Format } from "./schemas";

export type StageTitle = "Absolute Cinema" | "Lock In";

export enum StageValues {
  Main = "Absolute Cinema",
  Side = "Lock In",
}

export type Speaker = {
  id: string;
  _name?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  imageUrl?: string;
  xLink?: string;
  xName?: string;
  lumaTicketSpeaker?: string;
  lumaTicketPlusOne?: string;
  invitationCode?: string;
  slideDeckFile?: string;
  dietary?: string;
  speakerPermitApproval?: string;
};

export type Session = {
  id: string;
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  stage?: StageTitle | undefined;
  speakerIds?: string[];
  moderatorIds?: string[];
  format?: string[];
  webPublishingStatus?: string[];
  actionsDeckReceived?: string | null;
  portalTelegramGroup?: string;
  greenlightTime?: string;
};

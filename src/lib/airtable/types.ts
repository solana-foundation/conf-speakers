export type StageTitle = "Main Stage" | "Side Stage";

export enum StageValues {
  Main = "Main Stage",
  Side = "Side Stage",
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
  slideDeckUrl?: string;
  dietary?: string;
};

export type Session = {
  id: string;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  stage?: StageTitle | undefined;
  speakerIds?: string[];
  moderatorIds?: string[];
  format?: string[];
  webPublishingStatus?: string[];
  slideDeckUrl?: string;
  portalTelegramGroup?: string;
  greenlightTime?: string;
};

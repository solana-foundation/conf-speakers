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
};

export type Session = {
  id: string;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  stage?: string;
  speakerIds?: string[];
};

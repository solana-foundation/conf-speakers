export type Speaker = {
  _name?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  imageUrl?: string;
  xLink?: string;
  xName?: string;
};

export type Session = {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  stage?: string;
};

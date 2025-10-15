import Airtable from "airtable";

const pat = process.env.AIRTABLE_PAT!;
const base = process.env.AIRTABLE_BASE!;

if (!base || !pat) {
  throw new Error("AIRTABLE_BASE or AIRTABLE_PAT is not set");
}

export const airtable = new Airtable({
  apiKey: pat,
}).base(base);

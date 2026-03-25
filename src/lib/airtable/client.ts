const pat = process.env.AIRTABLE_PAT;
const base = process.env.AIRTABLE_BASE;

if (!base || !pat) {
  throw new Error("AIRTABLE_BASE or AIRTABLE_PAT is not set");
}

export type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
};

type AirtableListResponse = {
  records?: AirtableRecord[];
  offset?: string;
  error?: {
    type?: string;
    message?: string;
  };
};

type AirtableRecordResponse = AirtableRecord & {
  error?: {
    type?: string;
    message?: string;
  };
};

type AirtableSortDirection = "asc" | "desc";

type AirtableListOptions = {
  filterByFormula?: string;
  maxRecords?: number;
  sort?: Array<{
    field: string;
    direction: AirtableSortDirection;
  }>;
};

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${base}`;

const buildAirtableUrl = (tableId: string, path?: string, params?: URLSearchParams) => {
  const url = new URL(`${AIRTABLE_API_URL}/${encodeURIComponent(tableId)}${path ? `/${encodeURIComponent(path)}` : ""}`);

  if (params) {
    url.search = params.toString();
  }

  return url;
};

const getErrorMessage = (payload: { error?: { type?: string; message?: string } } | null, fallback: string) => {
  if (!payload?.error) {
    return fallback;
  }

  return [payload.error.type, payload.error.message].filter(Boolean).join(": ") || fallback;
};

const requestAirtable = async <T extends { error?: { type?: string; message?: string } }>(url: URL): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${pat}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `Airtable request failed with status ${response.status}`));
  }

  if (payload.error) {
    throw new Error(getErrorMessage(payload, "Airtable request failed"));
  }

  return payload;
};

export const getAirtableRecord = async (tableId: string, recordId: string): Promise<AirtableRecord> => {
  return requestAirtable<AirtableRecordResponse>(buildAirtableUrl(tableId, recordId));
};

export const listAirtableRecords = async (tableId: string, options: AirtableListOptions = {}): Promise<AirtableRecord[]> => {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();

    if (typeof options.maxRecords === "number") {
      params.set("maxRecords", String(options.maxRecords));
    }

    if (options.filterByFormula) {
      params.set("filterByFormula", options.filterByFormula);
    }

    options.sort?.forEach((sort, index) => {
      params.set(`sort[${index}][field]`, sort.field);
      params.set(`sort[${index}][direction]`, sort.direction);
    });

    if (offset) {
      params.set("offset", offset);
    }

    const remainingRecords = typeof options.maxRecords === "number" ? options.maxRecords - records.length : undefined;
    if (typeof remainingRecords === "number") {
      params.set("pageSize", String(Math.max(1, Math.min(100, remainingRecords))));
    }

    const payload = await requestAirtable<AirtableListResponse>(buildAirtableUrl(tableId, undefined, params));
    records.push(...(payload.records ?? []));

    offset =
      typeof options.maxRecords === "number" && records.length >= options.maxRecords ? undefined : payload.offset;
  } while (offset);

  return records;
};

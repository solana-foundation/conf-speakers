import fs from "node:fs";
import path from "node:path";
import { airtableFieldMap, airtableRequiredFields, airtableTableIds } from "../src/lib/airtable/config";

type EnvMap = Record<string, string>;
type AirtableRecord = { id: string; fields?: Record<string, unknown> };

const cwd = process.cwd();

function parseEnvFile(filePath: string): EnvMap {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator);
        const rawValue = line.slice(separator + 1);
        const value =
          (rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"))
            ? rawValue.slice(1, -1)
            : rawValue;
        return [key, value];
      }),
  );
}

function loadEnv(): EnvMap {
  return {
    ...parseEnvFile(path.join(cwd, ".env")),
    ...parseEnvFile(path.join(cwd, ".env.local")),
  };
}

async function fetchAllRecords(baseId: string, tableId: string, token: string) {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("pageSize", "100");
    if (offset) {
      url.searchParams.set("offset", offset);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json()) as { records?: AirtableRecord[]; offset?: string; error?: unknown };

    if (!response.ok || !payload.records) {
      throw new Error(`Failed to fetch table ${tableId}: ${JSON.stringify(payload)}`);
    }

    records.push(...payload.records);
    offset = payload.offset;
  } while (offset);

  return records;
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function suggestAliases(canonicalField: string, actualFields: string[]) {
  const normalizedCanonical = normalizeName(canonicalField);
  const canonicalTokens = normalizedCanonical.split(" ").filter(Boolean);

  return actualFields.filter((field) => {
    const normalizedField = normalizeName(field);
    return (
      normalizedField.includes(normalizedCanonical) ||
      canonicalTokens.some((token) => token.length > 2 && normalizedField.includes(token))
    );
  });
}

function printTableAudit(
  label: keyof typeof airtableFieldMap,
  records: AirtableRecord[],
  aliases: (typeof airtableFieldMap)[typeof label],
) {
  const actualFields = [...new Set(records.flatMap((record) => Object.keys(record.fields ?? {})))].sort();
  const requiredFields = new Set(airtableRequiredFields[label] as readonly string[]);

  console.log(`\n== ${label.toUpperCase()} ==`);
  console.log(`records: ${records.length}`);
  console.log(`live fields: ${actualFields.length}`);

  for (const [canonicalField, fieldAliases] of Object.entries(aliases)) {
    const matchedAlias = (fieldAliases as readonly string[]).find((alias: string) => actualFields.includes(alias));
    const state = matchedAlias ? "ok" : requiredFields.has(canonicalField) ? "missing-required" : "missing-optional";
    const suggestions = matchedAlias ? [] : suggestAliases(canonicalField, actualFields);

    console.log(`- ${canonicalField}: ${state}`);
    console.log(`  aliases: ${(fieldAliases as readonly string[]).join(" | ")}`);
    if (matchedAlias) {
      console.log(`  matched: ${matchedAlias}`);
    }
    if (!matchedAlias && suggestions.length > 0) {
      console.log(`  suggestions: ${suggestions.join(" | ")}`);
    }
  }

  const configuredAliases = new Set(Object.values(aliases).flatMap((fieldAliases) => fieldAliases as readonly string[]));
  const unmappedFields = actualFields.filter((field) => !configuredAliases.has(field));

  console.log(`- unmapped live fields: ${unmappedFields.length}`);
  if (unmappedFields.length > 0) {
    for (const field of unmappedFields) {
      console.log(`  - ${field}`);
    }
  }
}

async function main() {
  const env = loadEnv();
  const baseId = env.AIRTABLE_BASE;
  const token = env.AIRTABLE_PAT;

  if (!baseId || !token) {
    throw new Error("AIRTABLE_BASE or AIRTABLE_PAT is missing from .env/.env.local");
  }

  const sessionsTable = airtableTableIds.sessions ?? env.AIRTABLE_TABLE_AGENDA;
  const speakersTable = airtableTableIds.speakers ?? env.AIRTABLE_TABLE_SPEAKERS;
  const formatsTable = airtableTableIds.formats ?? env.AIRTABLE_TABLE_FORMATS;

  if (!sessionsTable || !speakersTable || !formatsTable) {
    throw new Error("One or more Airtable table ids are missing");
  }

  console.log(`base: ${baseId}`);
  console.log(`sessions table: ${sessionsTable}`);
  console.log(`speakers table: ${speakersTable}`);
  console.log(`formats table: ${formatsTable}`);

  const [sessions, speakers, formats] = await Promise.all([
    fetchAllRecords(baseId, sessionsTable, token),
    fetchAllRecords(baseId, speakersTable, token),
    fetchAllRecords(baseId, formatsTable, token),
  ]);

  printTableAudit("session", sessions, airtableFieldMap.session);
  printTableAudit("speaker", speakers, airtableFieldMap.speaker);
  printTableAudit("format", formats, airtableFieldMap.format);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

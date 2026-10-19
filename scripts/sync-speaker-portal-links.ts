import fs from "node:fs";
import path from "node:path";

for (const file of [".env.local", ".env"]) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const separator = line.indexOf("=");
    const key = line.slice(0, separator);
    if (process.env[key] !== undefined) continue;
    const raw = line.slice(separator + 1).trim();
    process.env[key] =
      (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))
        ? raw.slice(1, -1)
        : raw.split(/\s+#/)[0];
  }
}

async function main() {
  const { generateKey } = await import("../src/lib/sign.server");
  const { getPrimaryFieldAlias } = await import("../src/lib/airtable/config");
  const { SITE_URL } = await import("../src/lib/site");

  const write = process.argv.includes("--write");
  const baseId = process.env.AIRTABLE_BASE;
  const tableId = process.env.AIRTABLE_TABLE_SPEAKERS;
  const viewId = process.env.AIRTABLE_SPEAKER_GREENLIGHT_VIEW;
  const token = process.env.AIRTABLE_PAT;
  const lifetime = Number(process.env.NEXT_PUBLIC_KEY_EXP);
  const secret = process.env.SITE_SECRET;

  if (!baseId || !tableId || !viewId || !token || !secret || !Number.isFinite(lifetime) || lifetime <= 0) {
    throw new Error("Airtable, SITE_SECRET, or NEXT_PUBLIC_KEY_EXP configuration is missing or invalid");
  }
  if (write && (secret === "secret" || secret.length < 20 || new URL(SITE_URL).protocol !== "https:")) {
    throw new Error("Writing links requires the deployed SITE_SECRET and an HTTPS production base URL");
  }

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  async function request<T>(url: URL, init?: RequestInit): Promise<T> {
    const response = await fetch(url, { ...init, headers, cache: "no-store" });
    const data = (await response.json()) as T & { error?: { message?: string } };
    if (!response.ok) throw new Error(data.error?.message || `Airtable returned ${response.status}`);
    return data;
  }

  const schema = await request<{
    tables: Array<{ id: string; fields: Array<{ id: string; name: string; type: string }> }>;
  }>(new URL(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`));
  const fieldName = getPrimaryFieldAlias("speaker", "portalLink");
  const field = schema.tables.find((table) => table.id === tableId)?.fields.find((item) => item.name === fieldName);
  if (!field || !["singleLineText", "url"].includes(field.type)) {
    throw new Error(`${fieldName} is missing or is not a writable URL/text field`);
  }

  type Record = { id: string; fields: { [fieldName: string]: unknown } };
  const records: Record[] = [];
  let offset: string | undefined;
  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
    url.searchParams.set("view", viewId);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const page = await request<{ records: Record[]; offset?: string }>(url);
    records.push(...page.records);
    offset = page.offset;
  } while (offset);

  const missing = records.filter((record) => !record.fields[fieldName]);
  const present = records.length - missing.length;
  console.log(
    `Greenlight records: ${records.length}; missing portal links: ${missing.length}; existing links left untouched: ${present}`,
  );
  if (!write || missing.length === 0) {
    console.log(
      write ? "No links to write." : "Dry run only. Re-run with --write after the production deployment is verified.",
    );
    return;
  }

  const expiry = Date.now() + lifetime;
  const firstToken = generateKey(expiry, "auth", missing[0].id);
  const preflightUrl = new URL(`/api/speakers/${missing[0].id}`, SITE_URL);
  preflightUrl.searchParams.set("key", firstToken);
  const preflightResponse = await fetch(preflightUrl, { cache: "no-store" });
  const preflightSpeaker = preflightResponse.ok ? ((await preflightResponse.json()) as { id?: string }) : null;
  if (preflightSpeaker?.id !== missing[0].id) {
    throw new Error(
      "Production did not accept a signed link for a Greenlight speaker; no Airtable records were changed",
    );
  }
  const loginResponse = await fetch(new URL("/email-link", SITE_URL), { cache: "no-store" });
  if (!loginResponse.ok || !(await loginResponse.text()).includes("Breakpoint 2026")) {
    throw new Error("Production does not show Breakpoint 2026 yet; no Airtable records were changed");
  }

  for (let index = 0; index < missing.length; index += 10) {
    const batch = missing.slice(index, index + 10).map((record) => {
      const url = new URL("/s", SITE_URL);
      url.searchParams.set("key", generateKey(expiry, "auth", record.id));
      return { id: record.id, fields: { [field.id]: url.toString() } };
    });
    await request(new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`), {
      method: "PATCH",
      body: JSON.stringify({ records: batch }),
    });
  }

  const verifyUrl = new URL(`https://api.airtable.com/v0/${baseId}/${tableId}`);
  verifyUrl.searchParams.set("view", viewId);
  verifyUrl.searchParams.set("pageSize", "100");
  verifyUrl.searchParams.append("fields[]", fieldName);
  const verified = await request<{ records: Record[] }>(verifyUrl);
  const stillMissing = verified.records.filter((record) => !record.fields[fieldName]).length;
  if (verified.records.length !== records.length || stillMissing > 0) {
    throw new Error(`Airtable readback found ${stillMissing} missing links among ${verified.records.length} records`);
  }
  console.log(`Wrote and verified ${missing.length} portal links in ${fieldName}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const CARD_PADDING = 56;
const TITLE_FONT_SIZE = 76;
const BODY_FONT_SIZE = 30;
const FOOTER_FONT_SIZE = 24;
const BODY_LINE_HEIGHT = 40;
const FOOTER_LINE_HEIGHT = 30;
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env") as {
  loadEnvConfig: (dir: string) => void;
};

function toPublicPath(assetPath: string): string {
  const normalizedPath = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  return path.join(process.cwd(), "public", normalizedPath);
}

async function resolveReadableAssetPath(assetPath: string): Promise<string> {
  const absolutePath = toPublicPath(assetPath);

  try {
    await fs.access(absolutePath);
    return absolutePath;
  } catch {
    if (!assetPath.toLowerCase().endsWith(".svg")) {
      throw new Error(`Missing asset: ${assetPath}`);
    }

    const pngFallbackPath = assetPath.replace(/\.svg$/i, ".png");
    const pngAbsolutePath = toPublicPath(pngFallbackPath);
    await fs.access(pngAbsolutePath);
    return pngAbsolutePath;
  }
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(value: string, maxCharsPerLine: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxCharsPerLine || currentLine.length === 0) {
      currentLine = nextLine;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildTextBlockSvg(lines: string[], x: number, y: number, fontSize: number, lineHeight: number, color: string): string {
  const tspans = lines
    .map((line, index) => {
      const dy = index === 0 ? 0 : lineHeight;
      return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<text x="${x}" y="${y}" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="500">${tspans}</text>`;
}

function buildOverlaySvg(eventName: string, eventDescription: string, eventLocation: string, siteHost: string): Buffer {
  const descriptionLines = wrapText(eventDescription, 48);
  const footerText = eventLocation ? `${eventLocation} • ${siteHost}` : siteHost;
  const footerLines = wrapText(footerText, 64);

  const svg = `
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroShade" x1="0" y1="0" x2="${CARD_WIDTH}" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="rgba(5, 9, 18, 0.86)" />
          <stop offset="42%" stop-color="rgba(5, 9, 18, 0.72)" />
          <stop offset="100%" stop-color="rgba(5, 9, 18, 0.3)" />
        </linearGradient>
      </defs>
      <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#heroShade)" />
      <text x="${CARD_PADDING}" y="350" fill="#f8fbff" font-family="Arial, Helvetica, sans-serif" font-size="${TITLE_FONT_SIZE}" font-weight="500">${escapeXml(eventName)}</text>
      ${buildTextBlockSvg(descriptionLines, CARD_PADDING, 405, BODY_FONT_SIZE, BODY_LINE_HEIGHT, "rgba(236, 245, 255, 0.9)")}
      ${buildTextBlockSvg(footerLines, CARD_PADDING, CARD_HEIGHT - CARD_PADDING - 8, FOOTER_FONT_SIZE, FOOTER_LINE_HEIGHT, "rgba(216, 243, 255, 0.86)")}
    </svg>
  `;

  return Buffer.from(svg);
}

async function generate() {
  loadEnvConfig(process.cwd());

  const {
    EVENT_DESCRIPTION,
    EVENT_LOCATION,
    EVENT_NAME,
    SITE_HOST,
    SITE_LOGO_HEIGHT,
    SITE_LOGO_PATH,
    SITE_LOGO_WIDTH,
    SOCIAL_BACKGROUND_IMAGE_PATH,
    SOCIAL_IMAGE_PATH,
  } = await import("../src/lib/site");

  const backgroundPath = await resolveReadableAssetPath(SOCIAL_BACKGROUND_IMAGE_PATH);
  const logoPath = await resolveReadableAssetPath(SITE_LOGO_PATH);
  const outputPath = toPublicPath(SOCIAL_IMAGE_PATH);

  if (backgroundPath === outputPath) {
    throw new Error(
      `Social image output path collides with background asset: output=${SOCIAL_IMAGE_PATH} background=${SOCIAL_BACKGROUND_IMAGE_PATH}`,
    );
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const logoBuffer = await sharp(logoPath)
    .resize({
      width: SITE_LOGO_WIDTH,
      height: SITE_LOGO_HEIGHT,
      fit: "contain",
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();

  const pipeline = sharp(backgroundPath)
    .resize(CARD_WIDTH, CARD_HEIGHT, { fit: "cover", position: "center" })
    .composite([
      { input: buildOverlaySvg(EVENT_NAME, EVENT_DESCRIPTION, EVENT_LOCATION, SITE_HOST) },
      { input: logoBuffer, left: CARD_PADDING, top: CARD_PADDING },
    ]);

  if (outputPath.toLowerCase().endsWith(".webp")) {
    await pipeline.webp({ quality: 92 }).toFile(outputPath);
  } else {
    await pipeline.png().toFile(outputPath);
  }

  process.stdout.write(`Generated ${path.relative(process.cwd(), outputPath)}\n`);
}

generate().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});

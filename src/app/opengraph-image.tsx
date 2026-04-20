import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  EVENT_DESCRIPTION,
  EVENT_LOCATION,
  EVENT_NAME,
  SITE_NAME,
  SITE_LOGO_HEIGHT,
  SITE_LOGO_PATH,
  SITE_LOGO_WIDTH,
  SITE_URL,
  SOCIAL_BACKGROUND_IMAGE_PATH,
} from "@/lib/site";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
const SITE_HOST = new URL(SITE_URL).host;
const TRIMMED_SVG_FALLBACK_LOGO_ASPECT_RATIO = 1937 / 730;

async function readPublicAssetAsDataUrl(assetPath: string): Promise<string> {
  const normalizedPath = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);
  const file = await readFile(absolutePath);
  return `data:image/png;base64,${file.toString("base64")}`;
}

async function resolveRenderableBackgroundPath(imagePath: string): Promise<string> {
  if (!imagePath.toLowerCase().endsWith(".webp")) {
    return imagePath;
  }

  const pngPath = imagePath.replace(/\.webp$/i, ".png");
  const normalizedPath = pngPath.startsWith("/") ? pngPath.slice(1) : pngPath;
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);

  try {
    await access(absolutePath);
    return pngPath;
  } catch {
    return imagePath;
  }
}

async function resolveRenderableLogoPath(imagePath: string): Promise<string> {
  if (!imagePath.toLowerCase().endsWith(".svg")) {
    return imagePath;
  }

  const pngPath = imagePath.replace(/\.svg$/i, ".png");
  const normalizedPath = pngPath.startsWith("/") ? pngPath.slice(1) : pngPath;
  const absolutePath = path.join(process.cwd(), "public", normalizedPath);

  try {
    await access(absolutePath);
    return pngPath;
  } catch {
    return "";
  }
}

export default async function OpenGraphImage() {
  const renderableBackgroundPath = await resolveRenderableBackgroundPath(SOCIAL_BACKGROUND_IMAGE_PATH);
  const backgroundImageUrl = await readPublicAssetAsDataUrl(renderableBackgroundPath);
  const renderableLogoPath = await resolveRenderableLogoPath(SITE_LOGO_PATH);
  const logoImageUrl = renderableLogoPath ? new URL(renderableLogoPath, SITE_URL).toString() : "";
  const isSvgLogoFallback = SITE_LOGO_PATH.toLowerCase().endsWith(".svg") && renderableLogoPath.toLowerCase().endsWith(".png");
  const logoDisplayHeight = SITE_LOGO_HEIGHT;
  const logoDisplayWidth = isSvgLogoFallback
    ? Math.round(logoDisplayHeight * TRIMMED_SVG_FALLBACK_LOGO_ASPECT_RATIO)
    : SITE_LOGO_WIDTH;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#08111d",
          color: "#f8fbff",
          overflow: "hidden",
        }}
      >
        <img
          src={backgroundImageUrl}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(5, 9, 18, 0.86) 0%, rgba(5, 9, 18, 0.72) 42%, rgba(5, 9, 18, 0.3) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "56px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {logoImageUrl ? (
              <img
                src={logoImageUrl}
                alt={SITE_NAME}
                width={logoDisplayWidth}
                height={logoDisplayHeight}
                style={{
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  fontSize: 24,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(216, 243, 255, 0.88)",
                }}
              >
                {SITE_NAME}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 72,
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                marginBottom: "18px",
              }}
            >
              {EVENT_NAME}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.32,
                color: "rgba(236, 245, 255, 0.9)",
              }}
            >
              {EVENT_DESCRIPTION}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "rgba(216, 243, 255, 0.86)",
              }}
            >
              <span>{EVENT_LOCATION ? `${EVENT_LOCATION} • ${SITE_HOST}` : SITE_HOST}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

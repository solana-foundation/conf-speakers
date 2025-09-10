import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/s/*", "/api/ics/*", "/api/*"],
      },
    ],
    sitemap: undefined,
  };
}

import type { Metadata } from "next";
import "./globals.css";
import { abcDiatype, macanMono, fhLecturis } from "../fonts";
import { SiteHeader } from "@/components/header";
import { Suspense } from "react";
import { EVENT_DESCRIPTION, EVENT_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: EVENT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: EVENT_DESCRIPTION,
    images: [
      {
        url: "/twitter-card.png",
        width: 1200,
        height: 630,
        alt: `${EVENT_NAME} speaker portal`,
      },
    ],
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: EVENT_DESCRIPTION,
    images: ["/twitter-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${abcDiatype.variable} ${macanMono.variable} ${fhLecturis.variable} antialiased`}>
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

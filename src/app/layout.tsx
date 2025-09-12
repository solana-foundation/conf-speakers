import type { Metadata } from "next";
import "./globals.css";
import { abcDiatype, macanMono, fhLecturis } from "../fonts";
import { SiteHeader } from "@/components/header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Breakpoint Speakers",
  description: "Detailed information about the speakers of the Breakpoint conference",
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

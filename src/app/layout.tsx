import type { Metadata } from "next";
import "./globals.css";
import { abcDiatype, macanMono, fhLecturis } from "../fonts";

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
        {children}
      </body>
    </html>
  );
}

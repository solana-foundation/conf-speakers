import localFont from "next/font/local";

export const abcDiatype = localFont({
  src: [
    {
      path: "./abc-diatype/ABCDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./abc-diatype/ABCDiatype-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./abc-diatype/ABCDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./abc-diatype/ABCDiatype-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./abc-diatype/ABCDiatype-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./abc-diatype/ABCDiatype-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-abc-diatype",
  display: "fallback",
  fallback: ["Arial", "sans-serif"],
});

export const fhLecturis = localFont({
  src: [
    {
      path: "./fh-lecturis/FHLecturis-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-fh-lecturis",
  display: "fallback",
  fallback: ["Arial", "sans-serif"],
});

export const macanMono = localFont({
  src: [
    {
      path: "./macan-mono/Macan-Mono-Medium.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-macan-mono",
  display: "fallback",
  fallback: ["Arial", "sans-serif"],
});

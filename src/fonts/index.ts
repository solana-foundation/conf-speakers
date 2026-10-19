import localFont from "next/font/local";

export const breakpointDisplay = localFont({
  src: "./bp26-extended/BP26-Extended.woff2",
  variable: "--font-breakpoint-display",
  display: "swap",
});

export const breakpointBody = localFont({
  src: [
    { path: "./abc-favorit/ABCFavorit-Regular.woff2", weight: "400" },
    { path: "./abc-favorit/ABCFavorit-Bold.woff2", weight: "700" },
  ],
  variable: "--font-breakpoint-body",
  display: "swap",
});

export const breakpointMono = localFont({
  src: "./abc-favorit-mono/ABCFavoritMono-Regular.woff2",
  variable: "--font-breakpoint-mono",
  display: "swap",
});

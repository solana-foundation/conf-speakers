import { NextRequest } from "next/server";

// TODO
export const generateHmac = () => {
  return process.env.SITE_SECRET;
};

export const isAuthenticated = (request: NextRequest) => {
  const query = new URLSearchParams(request.nextUrl.searchParams);
  const key = query.get("key");

  return key === generateHmac();
};

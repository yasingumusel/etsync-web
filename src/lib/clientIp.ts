import type { NextRequest } from "next/server";

/**
 * Best-effort real visitor IP for a request Vercel is serving. Used only to
 * forward it to the Express backend's rate limiters (see
 * routes/auth/account.js's clientIpKey()) - this process's own `req.ip`
 * would just be Vercel's internal address, not the visitor's.
 */
export function clientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

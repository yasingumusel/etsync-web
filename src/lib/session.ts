import crypto from "crypto";

const COOKIE_NAME = "mirrorstock_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days, matches the backend JWT's own expiry

type SessionPayload = { userId: string; exp: number };

function sign(value: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

/** Builds the signed cookie value for a freshly authenticated userId. */
export function createSessionCookieValue(userId: string): string {
  const payload: SessionPayload = { userId, exp: Date.now() + SESSION_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

/** Verifies a cookie value, returning the payload if valid/unexpired, else null. */
export function verifySessionCookieValue(cookieValue: string | undefined): SessionPayload | null {
  if (!cookieValue) return null;
  const [encoded, signature] = cookieValue.split(".");
  if (!encoded || !signature) return null;

  const expectedSig = sign(encoded);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSig);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) return null;

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, SESSION_TTL_MS };

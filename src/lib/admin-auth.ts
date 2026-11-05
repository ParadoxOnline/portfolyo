import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "sct_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "SabriCan2026!Admin";
}

function getSigningSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || `sct-discovery-secret-${getAdminPassword()}-v1`;
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  const payload = `admin:${issuedAt}`;
  const hmac = crypto.createHmac("sha256", getSigningSecret()).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  try {
    const [encodedPayload, signature] = token.split(".");
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    if (!payload.startsWith("admin:")) return false;

    const issuedAt = parseInt(payload.split(":")[1] || "0", 10);
    if (!issuedAt || Number.isNaN(issuedAt)) return false;

    // 14 days session validity
    const maxAgeMs = 14 * 24 * 60 * 60 * 1000;
    if (Date.now() - issuedAt > maxAgeMs) return false;

    const expectedHmac = crypto
      .createHmac("sha256", getSigningSecret())
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedHmac, "hex");
    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function verifyAdminPassword(inputPassword: string): boolean {
  const expected = getAdminPassword();
  const inputHash = crypto.createHash("sha256").update(inputPassword).digest();
  const expectedHash = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

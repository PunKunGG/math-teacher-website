import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword() && getAdminSessionSecret());
}

function signTimestamp(timestamp: string, secret: string) {
  return createHmac("sha256", secret).update(timestamp).digest("hex");
}

function safeEqualString(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function validateAdminPassword(inputPassword: string) {
  const password = getAdminPassword();
  if (!password) {
    return false;
  }

  return safeEqualString(inputPassword, password);
}

export function createAdminSessionToken() {
  const secret = getAdminSessionSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }

  const timestamp = String(Date.now());
  const signature = signTimestamp(timestamp, secret);

  return `${timestamp}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const secret = getAdminSessionSecret();
  if (!secret) {
    return false;
  }

  const [timestamp, signature] = token.split(".");

  if (!timestamp || !signature) {
    return false;
  }

  const issuedAt = Number(timestamp);
  if (Number.isNaN(issuedAt)) {
    return false;
  }

  const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;
  if (Date.now() - issuedAt > maxAgeMs) {
    return false;
  }

  const expectedSignature = signTimestamp(timestamp, secret);
  return safeEqualString(signature, expectedSignature);
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminSessionMaxAgeSeconds() {
  return SESSION_MAX_AGE_SECONDS;
}

export function getCookieValueFromHeader(
  cookieHeader: string | null,
  cookieName: string,
) {
  if (!cookieHeader) {
    return undefined;
  }

  const chunks = cookieHeader.split(";");
  for (const chunk of chunks) {
    const [name, ...rest] = chunk.trim().split("=");
    if (name === cookieName) {
      return rest.join("=");
    }
  }

  return undefined;
}

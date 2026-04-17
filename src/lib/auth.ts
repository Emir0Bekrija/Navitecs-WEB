// Auth utilities using Web Crypto API — works in both Edge Runtime (middleware) and Node.js 18+

export const COOKIE_NAME = "admin_session";
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret)
    throw new Error(
      "SESSION_SECRET environment variable is not set. See .env.local.example.",
    );
  return secret;
}

function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd)
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. See .env.local.example.",
    );
  return pwd;
}

async function computeHmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(data),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  const payload = btoa(
    JSON.stringify({ exp: Date.now() + TOKEN_EXPIRY_MS }),
  );
  const sig = await computeHmac(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSecret();
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const payload = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    const expectedSig = await computeHmac(payload, secret);
    if (!constantTimeEqual(sig, expectedSig)) return false;

    const { exp } = JSON.parse(atob(payload)) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export async function verifyPassword(input: string): Promise<boolean> {
  const stored = getAdminPassword();
  const enc = new TextEncoder();
  const [h1, h2] = await Promise.all([
    globalThis.crypto.subtle.digest("SHA-256", enc.encode(input)),
    globalThis.crypto.subtle.digest("SHA-256", enc.encode(stored)),
  ]);
  const a = new Uint8Array(h1);
  const b = new Uint8Array(h2);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

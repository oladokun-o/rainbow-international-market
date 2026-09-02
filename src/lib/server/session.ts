import { createHmac } from 'crypto';
import { redirect, type Cookies, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { UserRole } from '$lib/models/User';

const COOKIE_NAME = 'rim_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionData {
  userId: string;
  role: UserRole;
  name: string;
}

function signingKey(): string {
  return env.SESSION_SECRET ?? 'rim-dev-only-change-in-prod';
}

function signPayload(payload: string): string {
  return createHmac('sha256', signingKey()).update(payload).digest('hex');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function setSession(cookies: Cookies, data: SessionData) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = signPayload(payload);
  cookies.set(COOKIE_NAME, `${payload}.${sig}`, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE
  });
}

export function getSession(cookies: Cookies): SessionData | null {
  const raw = cookies.get(COOKIE_NAME);
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot === -1) return null;
  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!constantTimeEqual(sig, signPayload(payload))) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionData;
  } catch {
    return null;
  }
}

export function clearSession(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

/** Guard for protected /admin pages/endpoints. Redirects to login on a page
 * request; callers that need a non-redirecting check use `getSession`. */
export function requireSession(event: RequestEvent): SessionData {
  const session = getSession(event.cookies);
  if (session) return session;
  const next = encodeURIComponent(event.url.pathname + event.url.search);
  throw redirect(303, `/admin/login?next=${next}`);
}

/** Roles allowed to move an order to a given status. */
export function canSetStatus(role: UserRole, status: string): boolean {
  if (role === 'owner' || role === 'manager') return true;
  // staff may only advance an order through the fulfilment states
  return ['confirmed', 'ready', 'collected'].includes(status);
}

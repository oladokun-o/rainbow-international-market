import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { EmailChannel } from '$lib/notifications/email';
import { isValidEmail } from '$lib/utils';
import type { RequestHandler } from './$types';

// Simple in-memory rate limit — one submission per IP per 30s. Best-effort;
// resets on cold start, which is fine for a low-traffic contact form.
const lastSeen = new Map<string, number>();

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const ip = getClientAddress();
  const now = Date.now();
  if (now - (lastSeen.get(ip) ?? 0) < 30_000) {
    throw error(429, 'Please wait a moment before sending another message.');
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
  } | null;

  const name = (body?.name ?? '').trim();
  const email = (body?.email ?? '').trim();
  const message = (body?.message ?? '').trim();

  if (!name || !isValidEmail(email) || !message) {
    throw error(400, 'Please fill in your name, a valid email, and a message.');
  }
  if (message.length > 4000) {
    throw error(400, 'That message is a bit long — please trim it down.');
  }

  lastSeen.set(ip, now);

  const to = env.ADMIN_EMAIL?.trim();
  if (to) {
    const channel = new EmailChannel();
    await channel.send({
      to,
      audience: 'admin',
      event: 'created',
      subject: `Contact form — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`
    });
  } else {
    console.info(`[contact] no ADMIN_EMAIL set — message from ${email} not delivered:\n${message}`);
  }

  return json({ ok: true });
};

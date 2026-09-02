import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import type { ChannelResult, NotificationChannel, OrderNotification } from './channel';

const FROM = () =>
  env.EMAIL_FROM ?? 'Rainbow International Market <onboarding@resend.dev>';

/**
 * Transactional email via Resend. Skips gracefully (no throw) when
 * `RESEND_API_KEY` is absent, so the store can run without email configured.
 */
export class EmailChannel implements NotificationChannel {
  readonly name = 'email';

  isConfigured(): boolean {
    return Boolean(env.RESEND_API_KEY);
  }

  async send(message: OrderNotification): Promise<ChannelResult> {
    if (!this.isConfigured()) {
      console.info(`[notifications:email] skipped (no RESEND_API_KEY) — ${message.subject}`);
      return { channel: this.name, ok: false, skipped: true };
    }

    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: FROM(),
        to: message.to,
        subject: message.subject,
        html: message.html ?? wrap(message.subject, message.text),
        text: message.text
      });
      if (error) {
        console.error('[notifications:email] Resend error', error);
        return { channel: this.name, ok: false, error: error.message };
      }
      return { channel: this.name, ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[notifications:email] send failed', msg);
      return { channel: this.name, ok: false, error: msg };
    }
  }
}

/** Minimal branded HTML shell for plain-text messages that have no `html`. */
function wrap(title: string, text: string): string {
  const body = text
    .split('\n')
    .map((line) => (line.trim() === '' ? '<br />' : escapeHtml(line)))
    .join('<br />');
  return `<!doctype html><html><body style="margin:0;background:#fbf7ef;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#054e32;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:2px solid rgba(5,78,50,0.12);border-radius:16px;padding:28px;">
    <p style="margin:0 0 16px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#006b3c;font-weight:700;">Rainbow International Market</p>
    <h1 style="margin:0 0 16px;font-size:20px;color:#006b3c;">${escapeHtml(title)}</h1>
    <p style="margin:0;font-size:14px;line-height:1.6;">${body}</p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

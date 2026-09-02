import type { ChannelResult, NotificationChannel, OrderNotification } from './channel';

/**
 * Placeholder WhatsApp channel. The brief scopes WhatsApp as "framework ready
 * for future integration" — this keeps the dispatch pipeline shaped for it
 * without committing to a provider. When a provider (Twilio, WhatsApp Business
 * API, …) is chosen, implement `send()` and make `isConfigured()` check its
 * env vars.
 */
export class WhatsAppChannel implements NotificationChannel {
  readonly name = 'whatsapp';

  isConfigured(): boolean {
    return false;
  }

  async send(message: OrderNotification): Promise<ChannelResult> {
    console.info(
      `[notifications:whatsapp] not implemented — would send to ${message.to}: ${message.subject}`
    );
    return { channel: this.name, ok: false, skipped: true, error: 'not_implemented' };
  }
}

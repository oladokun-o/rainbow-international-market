// A delivery channel for order notifications. Phase 6 ships EmailChannel;
// WhatsAppChannel is a stub whose `isConfigured()` returns false until a
// provider is wired up (per the brief: "framework ready for future integration").

export interface OrderNotification {
  /** Who the message is for. */
  to: string;
  audience: 'customer' | 'admin';
  event: 'created' | 'confirmed' | 'ready' | 'collected' | 'cancelled';
  subject: string;
  /** Plain-text body (used as-is for SMS/WhatsApp; wrapped in HTML for email). */
  text: string;
  /** Pre-rendered HTML body for email channels. */
  html?: string;
}

export interface ChannelResult {
  channel: string;
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

export interface NotificationChannel {
  readonly name: string;
  /** True only when the channel has everything it needs to actually send. */
  isConfigured(): boolean;
  send(message: OrderNotification): Promise<ChannelResult>;
}

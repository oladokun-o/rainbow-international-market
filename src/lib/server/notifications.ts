// Order notification dispatch. Iterates the configured channels (email is
// live; WhatsApp is a stub per the brief), records what was sent, and never
// throws — a notification failure must not fail an order.

import { env } from '$env/dynamic/private';
import { EmailChannel } from '$lib/notifications/email';
import { WhatsAppChannel } from '$lib/notifications/whatsapp';
import type { NotificationChannel, OrderNotification } from '$lib/notifications/channel';
import {
  adminNewOrderMessage,
  customerMessage,
  type NotifiableOrder
} from '$lib/notifications/messages';
import type { OrderStatus } from '$lib/models/Order';

const channels: NotificationChannel[] = [new EmailChannel(), new WhatsAppChannel()];

export type OrderNotificationEvent =
  | { type: 'created' }
  | { type: 'status_changed'; status: OrderStatus };

export interface NotifyResult {
  /** True if at least one customer-facing channel delivered. */
  customerNotified: boolean;
}

async function deliver(message: OrderNotification): Promise<boolean> {
  let delivered = false;
  for (const channel of channels) {
    const result = await channel.send(message).catch((e) => ({
      channel: channel.name,
      ok: false,
      error: e instanceof Error ? e.message : String(e)
    }));
    if (result.ok) delivered = true;
  }
  return delivered;
}

export async function notifyOrder(
  order: NotifiableOrder,
  event: OrderNotificationEvent
): Promise<NotifyResult> {
  let customerNotified = false;

  try {
    if (event.type === 'created') {
      const customer = customerMessage(order, 'created');
      if (customer) customerNotified = await deliver(customer);

      const adminEmail = env.ADMIN_EMAIL?.trim();
      if (adminEmail) {
        await deliver(adminNewOrderMessage(order, adminEmail));
      }
    } else {
      const customer = customerMessage(order, event.status);
      if (customer) customerNotified = await deliver(customer);
    }
  } catch (e) {
    console.error('[notifications] notifyOrder failed', e);
  }

  return { customerNotified };
}

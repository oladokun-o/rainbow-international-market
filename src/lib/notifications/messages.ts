import { formatCents } from '$lib/utils';
import { formatPickupDateLabel } from '$lib/pickup';
import type { OrderStatus } from '$lib/models/Order';
import type { OrderNotification } from './channel';

export interface NotifiableOrder {
  orderRef: string;
  customer: { name: string; email: string; phone: string };
  items: { name: string; quantity: number; lineTotalCents: number }[];
  totalCents: number;
  pickupDate: string;
  pickupNotes?: string | null;
  status: OrderStatus;
}

const BASE_URL = () => process.env.PUBLIC_BASE_URL ?? '';

function itemLines(order: NotifiableOrder): string {
  return order.items
    .map((i) => `  ${i.quantity} × ${i.name} — ${formatCents(i.lineTotalCents)}`)
    .join('\n');
}

function orderBlock(order: NotifiableOrder): string {
  return [
    `Order ${order.orderRef}`,
    '',
    itemLines(order),
    '',
    `Total (cash on pickup): ${formatCents(order.totalCents)}`,
    `Pickup: ${formatPickupDateLabel(order.pickupDate)}`,
    order.pickupNotes ? `Note: ${order.pickupNotes}` : ''
  ]
    .filter(Boolean)
    .join('\n');
}

function trackLine(order: NotifiableOrder): string {
  const base = BASE_URL();
  return base ? `\nTrack your order: ${base}/track/${order.orderRef}` : '';
}

/** Customer-facing message for a given lifecycle event. Returns null when the
 * event doesn't warrant a customer email (e.g. an internal-only transition). */
export function customerMessage(
  order: NotifiableOrder,
  event: 'created' | OrderStatus
): OrderNotification | null {
  const common = { to: order.customer.email, audience: 'customer' as const };

  if (event === 'created') {
    return {
      ...common,
      event: 'created',
      subject: `We've got your order — ${order.orderRef}`,
      text: `Hi ${order.customer.name},\n\nThanks for your order. Pay cash when you collect.\n\n${orderBlock(order)}${trackLine(order)}`
    };
  }
  if (event === 'confirmed') {
    return {
      ...common,
      event: 'confirmed',
      subject: `Order confirmed — ${order.orderRef}`,
      text: `Hi ${order.customer.name},\n\nYour order is confirmed and we're getting it ready.\n\n${orderBlock(order)}${trackLine(order)}`
    };
  }
  if (event === 'ready') {
    return {
      ...common,
      event: 'ready',
      subject: `Your order is ready for pickup — ${order.orderRef}`,
      text: `Hi ${order.customer.name},\n\nYour order is ready. Come collect it and pay cash at the counter.\n\n${orderBlock(order)}${trackLine(order)}`
    };
  }
  if (event === 'collected') {
    return {
      ...common,
      event: 'collected',
      subject: `Thanks for shopping with us — ${order.orderRef}`,
      text: `Hi ${order.customer.name},\n\nYour order is marked collected. Thanks for shopping with Rainbow International Market.`
    };
  }
  if (event === 'cancelled') {
    return {
      ...common,
      event: 'cancelled',
      subject: `Order cancelled — ${order.orderRef}`,
      text: `Hi ${order.customer.name},\n\nYour order ${order.orderRef} has been cancelled. If this is unexpected, please contact the store.`
    };
  }
  // 'pending' has no customer message of its own (covered by 'created').
  return null;
}

/** Admin-facing "new order" message. */
export function adminNewOrderMessage(order: NotifiableOrder, to: string): OrderNotification {
  const base = BASE_URL();
  return {
    to,
    audience: 'admin',
    event: 'created',
    subject: `New order ${order.orderRef} — ${formatCents(order.totalCents)}`,
    text: [
      `New order from ${order.customer.name}`,
      `${order.customer.email} · ${order.customer.phone}`,
      '',
      orderBlock(order),
      base ? `\nManage: ${base}/admin/orders` : ''
    ]
      .filter(Boolean)
      .join('\n')
  };
}

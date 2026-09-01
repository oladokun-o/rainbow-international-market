// Notification seam. Phase 6 wires the real email (Resend) and WhatsApp channels
// behind this function; for now it only logs so the order-creation path has a
// stable call site. A notification failure must never fail an order.

export interface OrderNotificationEvent {
  type: 'created' | 'status_changed';
}

export async function notifyOrder(
  order: { orderRef?: string } | Record<string, unknown>,
  event: OrderNotificationEvent
): Promise<void> {
  const ref = (order as { orderRef?: string })?.orderRef ?? 'unknown';
  console.info(`[notifications] notifyOrder ${event.type} ${ref}`);
}

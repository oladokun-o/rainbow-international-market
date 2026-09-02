import { connectDB } from '$lib/server/db';
import { Order, type OrderStatus } from '$lib/models/Order';
import { notifyOrder } from '$lib/server/notifications';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'ready',
  'collected',
  'cancelled'
];

export class OrderError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

/**
 * Moves an order to a new status, appends a history entry, and fires the
 * customer notification for that transition. A notification failure is logged
 * but does not fail the update.
 */
export async function setOrderStatus(
  orderId: string,
  status: OrderStatus,
  actorName: string
): Promise<void> {
  if (!ORDER_STATUSES.includes(status)) {
    throw new OrderError(400, 'Unknown order status.');
  }

  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) throw new OrderError(404, 'Order not found.');

  if (order.status === status) return;

  order.status = status;
  order.history.push({ status, at: new Date(), note: `Set to ${status} by ${actorName}` });
  await order.save();

  try {
    const { customerNotified } = await notifyOrder(order.toObject(), {
      type: 'status_changed',
      status
    });
    if (customerNotified && !order.notified.email) {
      order.notified.email = true;
      await order.save();
    }
  } catch (e) {
    console.error('[orders] status-change notification failed', e);
  }
}

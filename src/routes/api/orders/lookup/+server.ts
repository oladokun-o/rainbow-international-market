import { error, json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Order } from '$lib/models/Order';
import { isValidEmail } from '$lib/utils';
import type { RequestHandler } from './$types';

// Device-session lookup for /my-orders — verifies identity with email + the
// last 4 digits of phone (never a full phone number, never a password).
// Deliberately returns a generic 404 either way so this can't be used to
// probe whether an email placed an order.

interface IncomingBody {
  email?: unknown;
  phoneLast4?: unknown;
}

export const POST: RequestHandler = async ({ request }) => {
  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    throw error(400, 'Invalid request.');
  }

  const email = String(body.email ?? '')
    .trim()
    .toLowerCase();
  const phoneLast4 = String(body.phoneLast4 ?? '').replace(/\D/g, '').slice(-4);

  if (!isValidEmail(email)) throw error(400, 'Enter a valid email address.');
  if (phoneLast4.length !== 4) throw error(400, 'Enter the last 4 digits of your phone number.');

  await connectDB();

  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const orders = await Order.find({ 'customer.email': { $regex: new RegExp(`^${escaped}$`, 'i') } })
    .select('orderRef customer.phone status items subtotalCents totalCents pickupDate createdAt')
    .sort({ createdAt: -1 })
    .lean();

  const matched = orders.filter((o) => {
    const stored = String(o.customer?.phone ?? '').replace(/\D/g, '');
    return stored.endsWith(phoneLast4);
  });

  if (matched.length === 0) {
    throw error(404, 'No orders found for that email and phone combination.');
  }

  const result = matched.map((o) => ({
    orderRef: o.orderRef,
    status: o.status,
    pickupDate: o.pickupDate,
    totalCents: o.totalCents,
    itemCount: Array.isArray(o.items) ? o.items.length : 0,
    createdAt: o.createdAt
  }));

  return json({ orders: result });
};

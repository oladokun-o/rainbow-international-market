import { error, json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Order } from '$lib/models/Order';
import type { RequestHandler } from './$types';

// Batch status refresh for the cached /my-orders list — lets the client prune
// collected/cancelled orders without repeating a full email+phone lookup.

interface IncomingBody {
  refs?: unknown;
}

export const POST: RequestHandler = async ({ request }) => {
  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    throw error(400, 'Invalid request.');
  }

  const refs = Array.isArray(body.refs)
    ? [...new Set(body.refs.map((r) => String(r).trim().toUpperCase()).filter(Boolean))]
    : [];
  if (refs.length === 0) return json({});

  await connectDB();
  const orders = await Order.find({ orderRef: { $in: refs } })
    .select('orderRef status')
    .lean();

  const statuses: Record<string, string> = {};
  for (const o of orders) statuses[o.orderRef] = o.status;

  return json(statuses);
};

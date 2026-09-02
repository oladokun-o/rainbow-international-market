import { error } from '@sveltejs/kit';
import { getSession } from '$lib/server/session';
import { connectDB } from '$lib/server/db';
import { Order, type OrderStatus } from '$lib/models/Order';
import { ORDER_STATUSES } from '$lib/server/orders';
import type { RequestHandler } from './$types';

// +server routes don't inherit the /admin layout guard — re-check the session here.
function csvCell(value: unknown): string {
  const s = value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
  const session = getSession(cookies);
  if (!session) throw error(401, 'Not signed in.');

  await connectDB();

  const status = url.searchParams.get('status') as OrderStatus | null;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const q = (url.searchParams.get('q') ?? '').trim();

  const filter: Record<string, unknown> = {};
  if (status && ORDER_STATUSES.includes(status)) filter.status = status;
  if (from || to) {
    const range: Record<string, string> = {};
    if (from) range.$gte = from;
    if (to) range.$lte = to;
    filter.pickupDate = range;
  }
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ orderRef: rx }, { 'customer.name': rx }, { 'customer.phone': rx }];
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

  const header = [
    'Order ref',
    'Placed',
    'Status',
    'Customer',
    'Email',
    'Phone',
    'Pickup date',
    'Pickup notes',
    'Items',
    'Total (USD)'
  ];

  const rows = orders.map((o) => {
    const items = (o.items ?? [])
      .map((i) => `${i.quantity}x ${i.name}`)
      .join('; ');
    return [
      o.orderRef,
      new Date(o.createdAt).toISOString(),
      o.status,
      o.customer?.name ?? '',
      o.customer?.email ?? '',
      o.customer?.phone ?? '',
      o.pickupDate ?? '',
      o.pickupNotes ?? '',
      items,
      (o.totalCents / 100).toFixed(2)
    ]
      .map(csvCell)
      .join(',');
  });

  const csv = [header.map(csvCell).join(','), ...rows].join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="rainbow-orders-${stamp}.csv"`,
      'cache-control': 'no-store'
    }
  });
};

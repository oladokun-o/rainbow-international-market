import { stegaClean } from '@sanity/sveltekit';
import { serverClient } from '$lib/sanity/client.server';
import { lowStockProductsQuery, type LowStockProduct } from '$lib/sanity';
import { connectDB } from '$lib/server/db';
import { Order, type OrderStatus } from '$lib/models/Order';
import type { PageServerLoad } from './$types';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'ready', 'collected', 'cancelled'];

export const load: PageServerLoad = async () => {
  await connectDB();

  const counts = await Order.aggregate<{ _id: OrderStatus; n: number }>([
    { $group: { _id: '$status', n: { $sum: 1 } } }
  ]);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const c of counts) if (c._id in byStatus) byStatus[c._id] = c.n;

  const today = new Date().toISOString().slice(0, 10);
  const todaysPickups = await Order.find({
    pickupDate: today,
    status: { $in: ['pending', 'confirmed', 'ready'] }
  })
    .select('orderRef customer.name status pickupNotes items')
    .sort({ createdAt: 1 })
    .lean();

  let lowStock: LowStockProduct[] = [];
  try {
    lowStock = stegaClean(
      await serverClient.fetch<LowStockProduct[]>(lowStockProductsQuery)
    ) as LowStockProduct[];
  } catch {
    lowStock = [];
  }

  return {
    byStatus,
    openCount: byStatus.pending + byStatus.confirmed + byStatus.ready,
    todaysPickups: JSON.parse(JSON.stringify(todaysPickups)),
    lowStock
  };
};

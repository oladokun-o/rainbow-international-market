import { fail } from '@sveltejs/kit';
import type { FilterQuery } from 'mongoose';
import { connectDB } from '$lib/server/db';
import { Order, type IOrder, type OrderStatus } from '$lib/models/Order';
import { requireSession, canSetStatus } from '$lib/server/session';
import { setOrderStatus, OrderError, ORDER_STATUSES } from '$lib/server/orders';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async (event) => {
  requireSession(event);
  await connectDB();

  const url = event.url;
  const status = url.searchParams.get('status') as OrderStatus | null;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const q = (url.searchParams.get('q') ?? url.searchParams.get('ref') ?? '').trim();
  const pageNum = Math.max(1, Number(url.searchParams.get('page')) || 1);

  const filter: FilterQuery<IOrder> = {};
  if (status && ORDER_STATUSES.includes(status)) filter.status = status;
  if (from || to) {
    const range: Record<string, string> = {};
    if (from) range.$gte = from;
    if (to) range.$lte = to;
    filter.pickupDate = range;
  }
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { orderRef: rx },
      { 'customer.name': rx },
      { 'customer.phone': rx },
      { 'customer.email': rx }
    ];
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();

  return {
    orders: JSON.parse(JSON.stringify(orders)),
    total,
    page: pageNum,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    filters: { status: status ?? '', from: from ?? '', to: to ?? '', q },
    statuses: ORDER_STATUSES
  };
};

export const actions: Actions = {
  updateStatus: async (event) => {
    const session = requireSession(event);
    const form = await event.request.formData();
    const orderId = String(form.get('orderId') ?? '');
    const status = String(form.get('status') ?? '') as OrderStatus;

    if (!orderId || !status) return fail(400, { error: 'Missing order or status.' });
    if (!canSetStatus(session.role, status)) {
      return fail(403, { error: `Your role cannot set an order to "${status}".` });
    }

    try {
      await setOrderStatus(orderId, status, session.name);
    } catch (e) {
      if (e instanceof OrderError) return fail(e.status, { error: e.message });
      throw e;
    }
    return { ok: true };
  }
};

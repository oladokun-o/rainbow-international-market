import { error, json } from '@sveltejs/kit';
import { stegaClean } from '@sanity/sveltekit';
import { serverClient } from '$lib/sanity/client.server';
import { siteSettingsQuery, type SiteSettings } from '$lib/sanity';
import { connectDB } from '$lib/server/db';
import { Order } from '$lib/models/Order';
import { generateOrderRef } from '$lib/server/orderRef';
import { notifyOrder } from '$lib/server/notifications';
import { isValidPickupDate } from '$lib/pickup';
import { isValidEmail } from '$lib/utils';
import type { RequestHandler } from './$types';

// Uses the server Sanity client directly (not locals.sanity.loadQuery — that
// hydrates page-load queries for the browser; an API route just needs a fetch).

const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

interface IncomingItem {
  productId?: unknown;
  quantity?: unknown;
}
interface IncomingBody {
  customer?: { name?: unknown; email?: unknown; phone?: unknown };
  items?: unknown;
  pickupDate?: unknown;
  pickupNotes?: unknown;
}

interface CatalogProduct {
  _id: string;
  name: string;
  slug: string | null;
  unit?: string;
  price: number;
  inStock?: boolean;
}

export const POST: RequestHandler = async ({ request }) => {
  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    throw error(400, 'Invalid request.');
  }

  const name = String(body.customer?.name ?? '').trim();
  const email = String(body.customer?.email ?? '').trim();
  const phone = String(body.customer?.phone ?? '').trim();

  if (!name) throw error(400, 'Please enter your name.');
  if (!isValidEmail(email)) throw error(400, 'Please enter a valid email address.');
  if (!PHONE_RE.test(phone)) throw error(400, 'Please enter a valid phone number.');

  const rawItems = Array.isArray(body.items) ? (body.items as IncomingItem[]) : [];
  if (rawItems.length === 0) throw error(400, 'Your cart is empty.');

  const requested = rawItems.map((it) => {
    const productId = String(it.productId ?? '');
    const quantity = Number(it.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      throw error(400, 'Your cart has an invalid item.');
    }
    return { productId, quantity };
  });

  // ── Settings gate + pickup-date validation ────────────────────────
  const settings = stegaClean(
    await serverClient.fetch<SiteSettings | null>(siteSettingsQuery)
  ) as SiteSettings | null;
  if (settings && settings.orderingEnabled === false) {
    throw error(503, 'Online ordering is currently paused. Please check back soon.');
  }

  const pickupDate = String(body.pickupDate ?? '');
  if (!isValidPickupDate(pickupDate, settings?.pickupDays ?? [])) {
    throw error(400, 'Please choose a valid pickup date.');
  }
  const pickupNotes = String(body.pickupNotes ?? '').trim() || undefined;

  // ── Recompute every price server-side from Sanity ─────────────────
  const ids = [...new Set(requested.map((r) => r.productId))];
  const products = stegaClean(
    await serverClient.fetch<CatalogProduct[]>(
      `*[_type == "product" && _id in $ids]{ _id, name, "slug": slug.current, unit, price, inStock }`,
      { ids }
    )
  ) as CatalogProduct[];
  const byId = new Map(products.map((p) => [p._id, p]));

  let subtotalCents = 0;
  const items = requested.map((r) => {
    const product = byId.get(r.productId);
    if (!product) throw error(400, 'One of your items is no longer available.');
    if (product.inStock === false) throw error(400, `"${product.name}" is currently unavailable.`);
    if (!Number.isInteger(product.price) || product.price < 0) {
      throw error(400, `"${product.name}" is not priced for sale yet.`);
    }
    const unitPriceCents = product.price;
    const lineTotalCents = unitPriceCents * r.quantity;
    subtotalCents += lineTotalCents;
    return {
      productId: product._id,
      slug: product.slug ?? undefined,
      name: product.name,
      unit: product.unit,
      quantity: r.quantity,
      unitPriceCents,
      lineTotalCents
    };
  });

  const totalCents = subtotalCents;

  // ── Persist ──────────────────────────────────────────────────────
  await connectDB();

  let created: InstanceType<typeof Order> | null = null;
  for (let attempt = 0; attempt < 5 && !created; attempt++) {
    const orderRef = generateOrderRef();
    try {
      created = await Order.create({
        orderRef,
        customer: { name, email, phone },
        items,
        subtotalCents,
        totalCents,
        status: 'pending',
        history: [{ status: 'pending', at: new Date(), note: 'Order placed' }],
        pickupDate,
        pickupNotes,
        notified: { email: false, whatsapp: false }
      });
    } catch (e) {
      // Retry only on a duplicate orderRef; rethrow anything else.
      if (e && typeof e === 'object' && (e as { code?: number }).code === 11000) continue;
      throw e;
    }
  }

  if (!created) throw error(500, 'Could not create your order. Please try again.');

  try {
    const { customerNotified } = await notifyOrder(created.toObject(), { type: 'created' });
    if (customerNotified) {
      created.notified.email = true;
      await created.save();
    }
  } catch (e) {
    console.error('[orders] notifyOrder failed', e);
  }

  return json({ orderRef: created.orderRef, orderId: created._id.toString() }, { status: 201 });
};

// Public order lookup by reference — powers the confirmation and track pages.
// Deliberately returns no customer contact details.
export const GET: RequestHandler = async ({ url }) => {
  const ref = (url.searchParams.get('ref') ?? '').trim().toUpperCase();
  if (!ref) throw error(400, 'Missing order reference.');

  await connectDB();
  const order = await Order.findOne({ orderRef: ref })
    .select('orderRef status items subtotalCents totalCents pickupDate pickupNotes customer.name createdAt')
    .lean();

  if (!order) throw error(404, 'Order not found.');

  return json({
    orderRef: order.orderRef,
    status: order.status,
    customerName: order.customer?.name ?? null,
    items: order.items,
    subtotalCents: order.subtotalCents,
    totalCents: order.totalCents,
    pickupDate: order.pickupDate,
    pickupNotes: order.pickupNotes ?? null,
    createdAt: order.createdAt
  });
};

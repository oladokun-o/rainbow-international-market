import { stegaClean } from '@sanity/sveltekit/client';
import { siteSettingsQuery, type SiteSettings } from '$lib/sanity';
import type { PageServerLoad } from './$types';

interface TrackedOrder {
  orderRef: string;
  status: string;
  customerName: string | null;
  items: { name: string; quantity: number; lineTotalCents: number }[];
  totalCents: number;
  pickupDate: string;
  pickupNotes: string | null;
  createdAt: string;
}

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  const ref = params.ref.trim();
  const { loadQuery } = locals.sanity;

  const [res, settings] = await Promise.all([
    fetch(`/api/orders?ref=${encodeURIComponent(ref)}`),
    loadQuery<SiteSettings | null>(siteSettingsQuery)
  ]);

  const siteSettings = stegaClean(settings.data) as SiteSettings | null;
  if (!res.ok) {
    return { ref, order: null as TrackedOrder | null, siteSettings };
  }
  const order = (await res.json()) as TrackedOrder;
  return { ref, order, siteSettings };
};

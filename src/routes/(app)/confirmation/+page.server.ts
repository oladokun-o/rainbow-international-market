import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface OrderSummary {
  orderRef: string;
  status: string;
  customerName: string | null;
  items: { name: string; unit?: string; quantity: number; lineTotalCents: number }[];
  subtotalCents: number;
  totalCents: number;
  pickupDate: string;
  pickupNotes: string | null;
  createdAt: string;
}

export const load: PageServerLoad = async ({ url, fetch }) => {
  const ref = (url.searchParams.get('ref') ?? '').trim();
  if (!ref) throw redirect(303, '/shop');

  const res = await fetch(`/api/orders?ref=${encodeURIComponent(ref)}`);
  if (!res.ok) {
    // Soft state — don't hard-error if the ref is wrong or the lookup fails.
    return { ref, order: null as OrderSummary | null };
  }

  const order = (await res.json()) as OrderSummary;
  return { ref, order };
};

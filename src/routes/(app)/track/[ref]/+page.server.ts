import type { PageServerLoad } from './$types';

interface TrackedOrder {
  orderRef: string;
  status: string;
  items: { name: string; quantity: number; lineTotalCents: number }[];
  totalCents: number;
  pickupDate: string;
  pickupNotes: string | null;
  createdAt: string;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
  const ref = params.ref.trim();
  const res = await fetch(`/api/orders?ref=${encodeURIComponent(ref)}`);

  if (!res.ok) {
    return { ref, order: null as TrackedOrder | null };
  }
  const order = (await res.json()) as TrackedOrder;
  return { ref, order };
};

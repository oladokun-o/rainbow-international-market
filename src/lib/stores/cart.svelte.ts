// The in-progress order — line items built up while browsing the catalogue.
// Persisted to localStorage so a reload doesn't lose it. Prices are held as
// integer cents; the checkout API (Phase 5) re-fetches every product from
// Sanity and recomputes the authoritative total, so nothing here is trusted
// as more than a display convenience.

import { urlFor } from '$lib/sanity/image';
import type { Product } from '$lib/sanity/queries';

const STORAGE_KEY = 'rim-cart';

export interface CartLine {
  /** Stable line id (one per product — products have no modifiers). */
  id: string;
  productId: string;
  slug: string | null;
  name: string;
  unit?: string;
  /** Integer cents, snapshot at add time. */
  priceCents: number;
  quantity: number;
  /** Small thumbnail URL, if the product has an image. */
  image?: string;
}

function loadInitialLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function thumbFor(product: Product): string | undefined {
  const first = product.images?.[0];
  if (!first) return undefined;
  try {
    return urlFor(first).width(160).height(120).fit('crop').url();
  } catch {
    return undefined;
  }
}

class CartStore {
  lines = $state<CartLine[]>(loadInitialLines());

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines));
    } catch {
      // Private browsing / storage disabled — the cart just won't persist.
    }
  }

  /** Adds `qty` of a product, merging into the existing line if present. */
  add(product: Product, qty = 1) {
    const existing = this.lines.find((l) => l.productId === product._id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.lines.push({
        id: crypto.randomUUID(),
        productId: product._id,
        slug: product.slug,
        name: product.name,
        unit: product.unit,
        priceCents: product.price,
        quantity: qty,
        image: thumbFor(product)
      });
    }
    this.persist();
  }

  updateQuantity(id: string, qty: number) {
    if (qty <= 0) {
      this.remove(id);
      return;
    }
    const line = this.lines.find((l) => l.id === id);
    if (line) {
      line.quantity = qty;
      this.persist();
    }
  }

  remove(id: string) {
    this.lines = this.lines.filter((l) => l.id !== id);
    this.persist();
  }

  clear() {
    this.lines = [];
    this.persist();
  }

  get subtotalCents(): number {
    return this.lines.reduce((sum, l) => sum + l.priceCents * l.quantity, 0);
  }

  get count(): number {
    return this.lines.reduce((sum, l) => sum + l.quantity, 0);
  }
}

export const cart = new CartStore();

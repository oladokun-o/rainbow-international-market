// Saved products ("favorites" / wishlist). Persisted to localStorage only —
// there are no customer accounts, so this is per-device. Everything here is a
// display convenience; the /favorites page re-validates each entry against
// Sanity on load and drops anything that no longer exists.

import { urlFor } from '$lib/sanity/image';
import type { Product } from '$lib/sanity/queries';

const STORAGE_KEY = 'rim-favorites';

export interface FavoriteItem {
  productId: string;
  slug: string | null;
  name: string;
  /** Integer cents, snapshot at save time (display only). */
  priceCents: number;
  /** Small thumbnail URL, if the product had an image when saved. */
  image?: string;
  addedAt: number;
}

function loadInitial(): FavoriteItem[] {
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
    return urlFor(first).width(300).height(225).fit('crop').url();
  } catch {
    return undefined;
  }
}

class FavoritesStore {
  items = $state<FavoriteItem[]>(loadInitial());

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // Private browsing / storage disabled — favorites just won't persist.
    }
  }

  has(productId: string): boolean {
    return this.items.some((f) => f.productId === productId);
  }

  add(product: Product) {
    if (this.has(product._id)) return;
    this.items.push({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      priceCents: product.price,
      image: thumbFor(product),
      addedAt: Date.now()
    });
    this.persist();
  }

  remove(productId: string) {
    this.items = this.items.filter((f) => f.productId !== productId);
    this.persist();
  }

  /** Toggles a product's saved state; returns the new state. */
  toggle(product: Product): boolean {
    if (this.has(product._id)) {
      this.remove(product._id);
      return false;
    }
    this.add(product);
    return true;
  }

  /** Replaces the list with `next`, e.g. after re-validating against Sanity. */
  replace(next: FavoriteItem[]) {
    this.items = next;
    this.persist();
  }

  get count(): number {
    return this.items.length;
  }
}

export const favorites = new FavoritesStore();

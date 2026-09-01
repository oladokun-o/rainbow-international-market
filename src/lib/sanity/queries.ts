// GROQ queries + their TS shapes, kept together.
// The `groq` tag is re-exported by @sanity/sveltekit — never import the tag
// package directly (Phase 0 anti-pattern).
import { groq } from '@sanity/sveltekit';

// ── Shared shapes ────────────────────────────────────────────────────
export interface SanityImageRef {
  _type?: 'image';
  asset?: { _ref: string; _type: 'reference' };
  hotspot?: unknown;
  crop?: unknown;
}

export interface CategoryRef {
  title: string | null;
  slug: string | null;
}

// ── Product ──────────────────────────────────────────────────────────
// `price` and `compareAtPrice` are INTEGER CENTS (e.g. 1499 = $14.99) to
// match the cart/checkout math in later phases and avoid float drift.
const productProjection = groq`
  _id,
  name,
  "slug": slug.current,
  type,
  description,
  images,
  price,
  compareAtPrice,
  unit,
  inStock,
  stockQty,
  lowStockThreshold,
  featured,
  leadTimeNote,
  sortOrder,
  "category": category->{title, "slug": slug.current}
`;

export const productsQuery = groq`*[_type == "product"] | order(sortOrder asc, name asc){${productProjection}}`;

export const productBySlugQuery = groq`*[_type == "product" && slug.current == $slug][0]{${productProjection}}`;

export const lowStockProductsQuery = groq`*[_type == "product" && defined(stockQty) && stockQty <= lowStockThreshold] | order(stockQty asc){
  _id, name, "slug": slug.current, stockQty, lowStockThreshold, unit
}`;

export interface Product {
  _id: string;
  name: string;
  slug: string | null;
  type: 'grocery' | 'prepared';
  description?: unknown[];
  images?: SanityImageRef[];
  /** Integer cents. */
  price: number;
  /** Integer cents. */
  compareAtPrice?: number;
  unit?: string;
  inStock?: boolean;
  stockQty?: number;
  lowStockThreshold?: number;
  featured?: boolean;
  leadTimeNote?: string;
  sortOrder?: number;
  category?: CategoryRef;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  slug: string | null;
  stockQty?: number;
  lowStockThreshold?: number;
  unit?: string;
}

// ── Category ─────────────────────────────────────────────────────────
export const categoriesQuery = groq`*[_type == "category"] | order(sortOrder asc, title asc){
  _id, title, "slug": slug.current, description, image, sortOrder
}`;

export interface Category {
  _id: string;
  title: string;
  slug: string | null;
  description?: string;
  image?: SanityImageRef;
  sortOrder?: number;
}

// ── Site settings (singleton) ────────────────────────────────────────
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  _id,
  storeName,
  pickupAddress,
  phone,
  email,
  hoursNote,
  pickupInstructions,
  pickupDays,
  pickupWindow,
  orderingEnabled,
  announcement,
  promoBanner
}`;

export interface PromoBanner {
  enabled?: boolean;
  headline?: string;
  subtext?: string;
}

export interface SiteSettings {
  _id: string;
  storeName?: string;
  pickupAddress?: string;
  phone?: string;
  email?: string;
  hoursNote?: string;
  pickupInstructions?: string;
  /** 0 = Sunday … 6 = Saturday */
  pickupDays?: number[];
  pickupWindow?: string;
  orderingEnabled?: boolean;
  announcement?: string;
  promoBanner?: PromoBanner;
}

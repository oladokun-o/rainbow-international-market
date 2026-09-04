// Catalogue listing data. Reads run server-side through `locals.sanity` so the
// browser never needs a Sanity token (the dev `development` dataset is private).
//
// We return the RESOLVED `.data` arrays rather than the `{ query, options:
// { initial } }` shape: the shop grid does not need live preview / visual
// editing, and resolved data keeps the page component simple. Switch to the
// query-loader shape here if in-context editing of the grid is ever needed.
import { stegaClean } from '@sanity/sveltekit/client';
import {
  productsQuery,
  categoriesQuery,
  siteSettingsQuery,
  type Product,
  type Category,
  type SiteSettings
} from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'max-age=60, stale-while-revalidate=300' });

  const { loadQuery } = locals.sanity;
  const [products, categories, siteSettings] = await Promise.all([
    loadQuery<Product[]>(productsQuery),
    loadQuery<Category[]>(categoriesQuery),
    loadQuery<SiteSettings | null>(siteSettingsQuery)
  ]);

  // Strip any stega-encoded metadata — the storefront filters/routes on these
  // strings, and encoded characters would break exact matches.
  return {
    products: stegaClean(products.data ?? []) as Product[],
    categories: stegaClean(categories.data ?? []) as Category[],
    siteSettings: stegaClean(siteSettings.data) as SiteSettings | null
  };
};

import { error } from '@sveltejs/kit';
import { stegaClean } from '@sanity/sveltekit/client';
import {
  productBySlugQuery,
  relatedProductsQuery,
  siteSettingsQuery,
  type Product,
  type SiteSettings
} from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, setHeaders }) => {
  setHeaders({ 'cache-control': 'max-age=60, stale-while-revalidate=300' });

  const { loadQuery } = locals.sanity;
  const [product, siteSettings] = await Promise.all([
    loadQuery<Product | null>(productBySlugQuery, { slug: params.slug }),
    loadQuery<SiteSettings | null>(siteSettingsQuery)
  ]);

  const resolved = stegaClean(product.data) as Product | null;
  if (!resolved) error(404, 'Product not found');

  const related = resolved.categoryId
    ? await loadQuery<Product[]>(relatedProductsQuery, {
        id: resolved._id,
        categoryId: resolved.categoryId
      })
    : null;

  return {
    product: resolved,
    relatedProducts: related ? ((stegaClean(related.data) as Product[]) ?? []) : [],
    siteSettings: stegaClean(siteSettings.data) as SiteSettings | null
  };
};

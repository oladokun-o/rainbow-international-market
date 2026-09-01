import { stegaClean } from '@sanity/sveltekit';
import {
  featuredProductsQuery,
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
  const [featured, categories, siteSettings] = await Promise.all([
    loadQuery<Product[]>(featuredProductsQuery),
    loadQuery<Category[]>(categoriesQuery),
    loadQuery<SiteSettings | null>(siteSettingsQuery)
  ]);

  return {
    featured: stegaClean(featured.data ?? []) as Product[],
    categories: stegaClean(categories.data ?? []) as Category[],
    siteSettings: stegaClean(siteSettings.data) as SiteSettings | null
  };
};

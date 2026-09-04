import { stegaClean } from '@sanity/sveltekit/client';
import { siteSettingsQuery, type SiteSettings } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ 'cache-control': 'max-age=60, stale-while-revalidate=300' });
  const { loadQuery } = locals.sanity;
  const settings = await loadQuery<SiteSettings | null>(siteSettingsQuery);
  return { siteSettings: stegaClean(settings.data) as SiteSettings | null };
};

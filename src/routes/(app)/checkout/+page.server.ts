import { stegaClean } from '@sanity/sveltekit';
import { siteSettingsQuery, type SiteSettings } from '$lib/sanity';
import { nextPickupDates } from '$lib/pickup';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { loadQuery } = locals.sanity;
  const settings = await loadQuery<SiteSettings | null>(siteSettingsQuery);
  const data = stegaClean(settings.data) as SiteSettings | null;

  return {
    orderingEnabled: data?.orderingEnabled ?? true,
    pickupWindow: data?.pickupWindow ?? null,
    pickupInstructions: data?.pickupInstructions ?? null,
    pickupAddress: data?.pickupAddress ?? null,
    pickupDateOptions: nextPickupDates(data?.pickupDays ?? [], 14)
  };
};

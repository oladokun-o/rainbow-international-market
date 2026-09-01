// Passes preview state down to the client so the layout providers can enable
// visual editing only when preview mode is active.
// Per the Sanity SvelteKit integration guide.
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
  const { previewEnabled } = event.locals.sanity;
  return { previewEnabled };
};

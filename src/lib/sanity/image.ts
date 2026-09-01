// Image URL builder — named `createImageUrlBuilder` export (the default export
// logs a deprecation warning). Configured from the public client's project.
// Follows the Sanity SvelteKit integration guide (image.ts snippet).
import { createImageUrlBuilder } from '@sanity/image-url';
import { projectId, dataset } from '$lib/sanity/client';

const builder = createImageUrlBuilder({ projectId, dataset });

/** Build a CDN image URL from a Sanity image source, e.g.
 * `urlFor(product.images[0]).width(800).url()`. */
export function urlFor(source: unknown) {
  return builder.image(source as never);
}

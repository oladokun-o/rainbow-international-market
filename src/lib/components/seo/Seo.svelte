<script lang="ts">
  // Centralized SEO / Open Graph / Twitter meta, sourced from constants/site.ts.
  // Absolute URLs (canonical, og:url, og:image) are resolved against the CURRENT
  // request origin — not a hardcoded domain — so social-share previews work on
  // localhost, Vercel previews, and production alike.
  import { page } from '$app/state';
  import { SITE_NAME, SITE_DESCRIPTION, SITE_OG_IMAGE } from '$lib/constants/site';

  interface Props {
    title: string;
    description?: string;
    /** Root-relative path (e.g. "/") for canonical + og:url. */
    canonical?: string;
    /** Share image — root-relative or absolute. Defaults to the brand OG card. */
    image?: string;
    type?: 'website' | 'article';
    /** Set true to keep the page out of search indexes (e.g. previews). */
    noindex?: boolean;
    /** Structured data (schema.org), rendered as a JSON-LD script tag. */
    jsonLd?: Record<string, unknown>;
  }

  let {
    title,
    description = SITE_DESCRIPTION,
    canonical,
    image = SITE_OG_IMAGE,
    type = 'website',
    noindex = false,
    jsonLd
  }: Props = $props();

  // Resolve against the live origin so URLs are absolute and host-correct.
  const origin = $derived(page.url.origin);
  const imageUrl = $derived(image ? new URL(image, origin).href : undefined);
  const canonicalUrl = $derived(canonical ? new URL(canonical, origin).href : undefined);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="author" content={SITE_NAME} />
  <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
  {#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}

  <!-- Open Graph -->
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:locale" content="en_US" />
  {#if imageUrl}
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  {/if}
  {#if canonicalUrl}<meta property="og:url" content={canonicalUrl} />{/if}

  <!-- Twitter / X -->
  <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if imageUrl}<meta name="twitter:image" content={imageUrl} />{/if}

  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
  {/if}
</svelte:head>

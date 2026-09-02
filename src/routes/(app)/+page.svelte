<script lang="ts">
  import { goto } from '$app/navigation';
  import Seo from '$lib/components/seo/Seo.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import MenuItemCard from '$lib/components/ui/MenuItemCard.svelte';
  import PhotoPlaceholder from '$lib/components/ui/PhotoPlaceholder.svelte';
  import { formatCents } from '$lib/utils';
  import { urlFor, firstLine } from '$lib/sanity';
  import type { Product } from '$lib/sanity';
  import {
    SITE_NAME,
    SITE_DESCRIPTION,
    PRODUCT_CATEGORIES,
    PRIMARY_LOCATION,
    formatHoursSummary
  } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const settings = $derived(data.siteSettings);
  const promo = $derived(settings?.promoBanner);

  // Prefer Sanity categories; fall back to the static list so the page renders
  // fully before any content is seeded.
  const categoryLinks = $derived(
    data.categories.length > 0
      ? data.categories
          .filter((c) => c.slug)
          .map((c) => ({ label: c.title, slug: c.slug as string }))
      : PRODUCT_CATEGORIES.map((c) => ({ label: c.label, slug: c.slug }))
  );

  const featured = $derived(data.featured.slice(0, 6));

  const address = $derived(settings?.pickupAddress || PRIMARY_LOCATION.address);
  const phone = $derived(settings?.phone || PRIMARY_LOCATION.phone);
  const hours = $derived(
    settings?.hoursNote ||
      (settings?.pickupWindow ? `Pickup ${settings.pickupWindow}` : formatHoursSummary(PRIMARY_LOCATION))
  );

  function cardImage(p: Product): string | undefined {
    const first = p.images?.[0];
    if (!first) return undefined;
    try {
      return urlFor(first).width(600).height(450).fit('crop').url();
    } catch {
      return undefined;
    }
  }
</script>

<Seo title="{SITE_NAME} — African, Caribbean & Asian groceries in San Angelo, TX" canonical="/" description={SITE_DESCRIPTION} />

{#if promo?.enabled}
  <div class="bg-orange px-6 py-2.5 text-center text-deep">
    <p class="type-caption font-semibold">
      {promo.headline}{#if promo.subtext}<span class="font-normal"> — {promo.subtext}</span>{/if}
    </p>
  </div>
{/if}

<!-- Hero -->
<Section tone="cream" class="!pb-10">
  <div class="grid items-center gap-10 lg:grid-cols-2">
    <div>
      <p class="type-overline text-green">San Angelo, TX</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-green sm:text-5xl">
        {settings?.storeName || SITE_NAME}
      </h1>
      <p class="type-body-lg mt-4 max-w-xl text-deep/75">
        African, Caribbean, Asian and international groceries — plus prepared dishes cooked to order.
        Reserve online and pay cash on pickup.
      </p>
      <div class="mt-7 flex flex-wrap gap-3">
        <Button href="/shop">Browse the catalogue</Button>
        <Button href="/about" variant="secondary">About the store</Button>
      </div>
      {#if settings?.announcement}
        <p class="type-caption mt-5 text-deep/60">{settings.announcement}</p>
      {/if}
    </div>
    <div class="aspect-4/3 overflow-hidden rounded-surface">
      <PhotoPlaceholder label="Store photo" class="size-full" />
    </div>
  </div>
</Section>

<!-- Featured -->
{#if featured.length > 0}
  <Section tone="white">
    <div class="flex items-end justify-between gap-4">
      <h2 class="text-2xl font-semibold text-deep sm:text-3xl">Featured</h2>
      <a href="/shop" class="type-caption font-semibold text-green hover:underline">View all</a>
    </div>
    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each featured as product (product._id)}
        <a
          href={product.slug ? `/shop/${product.slug}` : undefined}
          class="block rounded-surface transition-transform hover:-translate-y-0.5"
        >
          <MenuItemCard
            layout="stack"
            name={product.name}
            description={firstLine(product.description)}
            price={formatCents(product.price)}
            image={cardImage(product)}
            imageAlt={product.name}
            tags={product.type === 'prepared' ? ['Made to order'] : []}
            soldOut={product.inStock === false}
            actionLabel="View"
            onAdd={() => product.slug && goto(`/shop/${product.slug}`)}
          />
        </a>
      {/each}
    </div>
  </Section>
{/if}

<!-- Categories -->
<Section tone="cream">
  <h2 class="text-2xl font-semibold text-deep sm:text-3xl">Shop by category</h2>
  <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each categoryLinks as category (category.slug)}
      <a
        href={`/shop?category=${category.slug}`}
        class="group flex items-center justify-between rounded-surface border-2 border-deep/10 bg-white/40 px-5 py-6 transition-colors hover:border-green"
      >
        <span class="text-[16px] font-semibold text-deep">{category.label}</span>
        <span class="font-display text-green transition-transform group-hover:translate-x-1">&rarr;</span>
      </a>
    {/each}
  </div>
</Section>

<!-- Store info -->
<Section tone="green">
  <div class="grid gap-8 text-cream sm:grid-cols-3">
    <div>
      <p class="type-overline text-cream/70">Pickup location</p>
      <p class="type-body mt-2 whitespace-pre-line">{address}</p>
    </div>
    <div>
      <p class="type-overline text-cream/70">Hours</p>
      <p class="type-body mt-2 whitespace-pre-line">{hours}</p>
      {#if settings?.pickupInstructions}
        <p class="type-caption mt-2 text-cream/70">{settings.pickupInstructions}</p>
      {/if}
    </div>
    <div>
      <p class="type-overline text-cream/70">Contact</p>
      {#if phone}
        <p class="type-body mt-2">{phone}</p>
      {/if}
      <p class="type-body mt-1">
        <a class="underline" href="/contact">Contact us</a>
      </p>
      {#if settings != null && !settings.orderingEnabled}
        <span class="mt-3 inline-block"><Badge tone="orange">Online ordering paused</Badge></span>
      {/if}
    </div>
  </div>
</Section>

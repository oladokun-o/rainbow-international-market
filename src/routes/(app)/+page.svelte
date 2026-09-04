<script lang="ts">
  import { page } from '$app/state';
  import {
    ShoppingBasket,
    Carrot,
    Snowflake,
    CupSoda,
    SprayCan,
    UtensilsCrossed,
    BadgeCheck,
    Wallet,
    Globe
  } from '@lucide/svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import MenuItemCard from '$lib/components/ui/MenuItemCard.svelte';
  import { cart } from '$lib/stores/cart.svelte';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { cn, formatCents } from '$lib/utils';
  import { urlFor, firstLine } from '$lib/sanity';
  import type { Product } from '$lib/sanity';
  import {
    SITE_NAME,
    SITE_DESCRIPTION,
    PRODUCT_CATEGORIES,
    PRIMARY_LOCATION,
    formatHoursSummary,
    isLocationOpenNow,
    groceryStoreJsonLd
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

  // Best-effort icon per known category slug — falls back to a generic
  // basket for anything seeded later that isn't in this list.
  const categoryIcons: Record<string, typeof ShoppingBasket> = {
    groceries: ShoppingBasket,
    'fresh-produce': Carrot,
    'frozen-foods': Snowflake,
    beverages: CupSoda,
    'household-essentials': SprayCan,
    'prepared-food': UtensilsCrossed
  };
  const categoryIcon = (slug: string) => categoryIcons[slug] ?? ShoppingBasket;

  const featured = $derived(data.featured.slice(0, 6));

  const address = $derived(settings?.pickupAddress || PRIMARY_LOCATION.address);
  const phone = $derived(settings?.phone || PRIMARY_LOCATION.phone);
  const hours = $derived(
    settings?.hoursNote ||
      (settings?.pickupWindow ? `Pickup ${settings.pickupWindow}` : formatHoursSummary(PRIMARY_LOCATION))
  );
  const openNow = $derived(isLocationOpenNow(PRIMARY_LOCATION));

  function cardImage(p: Product): string | undefined {
    const first = p.images?.[0];
    if (!first) return undefined;
    try {
      return urlFor(first).width(600).height(450).fit('crop').url();
    } catch {
      return undefined;
    }
  }

  function addToCart(p: Product) {
    cart.add(p, 1);
    toastStore.push(`${p.name} added to cart`, 'success', {
      action: { label: 'View cart', href: '/cart' },
      subtext: 'Pay cash on pickup in San Angelo'
    });
  }
</script>

<Seo
  title="{SITE_NAME} — African, Caribbean & Asian groceries in San Angelo, TX"
  canonical="/"
  description={SITE_DESCRIPTION}
  jsonLd={groceryStoreJsonLd(page.url.origin)}
/>

{#if promo?.enabled}
  <div class="bg-orange px-6 py-2.5 text-center text-deep">
    <p class="type-caption font-semibold">
      {promo.headline}{#if promo.subtext}<span class="font-normal"> — {promo.subtext}</span>{/if}
    </p>
  </div>
{/if}

<!-- Hero -->
<Section tone="cream" class="!pb-6">
  <div class="grid items-center gap-10 lg:grid-cols-2">
    <div>
      <p class="type-overline text-orange">San Angelo, TX</p>
      <h1 class="mt-3 text-4xl font-semibold leading-tight text-green sm:text-5xl">
        {settings?.storeName || SITE_NAME}
      </h1>
      <span class="mt-4 block h-1 w-16 rounded-full bg-yellow"></span>
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
    <div
      class="grid aspect-4/3 place-items-center overflow-hidden rounded-surface border-2 border-deep/10 bg-white/50"
    >
      <img src="/images/hero.jpg" alt="Rainbow International Market storefront" class="h-full w-full object-cover" />
    </div>
  </div>
</Section>

<!-- Compact pickup card -->
<Section tone="cream" class="!pt-0 !pb-6">
  <div class="rounded-surface border-2 border-deep/10 bg-white/60 p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-green/10 text-green">
          <Icon name="map-pin" size={18} />
        </span>
        <div>
          <p class="text-[15px] font-semibold text-deep">{address}</p>
          <p class="type-caption text-deep/60">{hours}</p>
        </div>
      </div>
      <span
        class={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
          openNow ? 'bg-green/10 text-green' : 'bg-deep/10 text-deep/60'
        )}
      >
        <span class={cn('size-1.5 rounded-full', openNow ? 'bg-green' : 'bg-deep/40')}></span>
        {openNow ? 'Open today' : 'Closed now'}
      </span>
    </div>
    <p class="mt-3 rounded-control bg-yellow/15 px-3.5 py-2.5 text-[13px] font-medium text-deep">
      Cash on pickup only — no card needed.
    </p>
  </div>
</Section>

<!-- Featured -->
{#if featured.length > 0}
  <Section tone="white">
    <div class="flex items-end justify-between gap-4">
      <h2 class="text-2xl font-semibold text-deep sm:text-3xl">Featured</h2>
      <a href="/shop" class="type-caption font-semibold text-orange hover:underline">View all</a>
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
            description={product.unit ?? firstLine(product.description)}
            price={formatCents(product.price)}
            image={cardImage(product)}
            imageAlt={product.name}
            tags={product.type === 'prepared' ? ['Made to order'] : []}
            soldOut={product.inStock === false}
            actionLabel="Add"
            onAdd={() => addToCart(product)}
            favorited={favorites.has(product._id)}
            onFavorite={() => favorites.toggle(product)}
          />
        </a>
      {/each}
    </div>
  </Section>
{/if}

<!-- Categories -->
<Section tone="cream">
  <h2 class="text-2xl font-semibold text-deep sm:text-3xl">Shop by category</h2>
  <div class="-mx-4 mt-6 flex gap-2.5 overflow-x-auto px-4 pb-2">
    {#each categoryLinks as category (category.slug)}
      {@const CategoryIcon = categoryIcon(category.slug)}
      <a
        href={`/shop?category=${category.slug}`}
        class="group flex shrink-0 items-center gap-2 rounded-full border-2 border-deep/10 bg-white/50 px-3.5 py-2.5 transition-colors hover:border-green"
      >
        <CategoryIcon size={16} class="shrink-0 text-green" />
        <span class="whitespace-nowrap text-[14px] font-semibold text-deep">{category.label}</span>
      </a>
    {/each}
  </div>
</Section>

<!-- Trust card -->
<Section tone="cream">
  <div class="rounded-surface bg-green p-6 text-cream sm:p-8">
    <p class="type-overline text-yellow">Community promise</p>
    <h3 class="mt-2 text-xl font-semibold sm:text-2xl">Your neighborhood market, right here in Texas</h3>
    <p class="type-body mt-2 max-w-2xl text-cream/80">
      Browse fresh arrivals from West &amp; East Africa, the Caribbean, and global sources. Pick up at our
      San Angelo counter at your convenience.
    </p>
    <div class="mt-5 flex flex-wrap gap-x-6 gap-y-2">
      <span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-yellow">
        <BadgeCheck size={16} /> Quality checked
      </span>
      <span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-yellow">
        <Wallet size={16} /> Cash on pickup
      </span>
      <span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-yellow">
        <Globe size={16} /> West & East Africa, Caribbean, Asia
      </span>
    </div>
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

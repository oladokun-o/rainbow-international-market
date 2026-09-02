<script lang="ts">
  import { page } from '$app/state';
  import Seo from '$lib/components/seo/Seo.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import MenuItemCard from '$lib/components/ui/MenuItemCard.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { cn, formatCents } from '$lib/utils';
  import { urlFor, firstLine } from '$lib/sanity';
  import type { Product } from '$lib/sanity';
  import { cart } from '$lib/stores/cart.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { SITE_NAME } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const isAvailable = (p: Product) => p.inStock !== false;

  let query = $state('');
  let activeCategory = $state(page.url.searchParams.get('category') ?? 'All');
  let sort = $state('featured');

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'name', label: 'Name: A–Z' }
  ];

  // "All" + one chip per category (keyed by slug, labelled by title).
  const chips = $derived([
    { slug: 'All', title: 'All' },
    ...data.categories
      .filter((c) => c.slug)
      .map((c) => ({ slug: c.slug as string, title: c.title }))
  ]);

  const filteredProducts = $derived(
    data.products
      .filter((p) => {
        const inCategory = activeCategory === 'All' || p.category?.slug === activeCategory;
        const q = query.trim().toLowerCase();
        const inSearch =
          q === '' ||
          p.name.toLowerCase().includes(q) ||
          (p.unit ?? '').toLowerCase().includes(q);
        return inCategory && inSearch;
      })
      .slice()
      .sort((a, b) => {
        // Available items always float above unavailable ones.
        const avail = Number(isAvailable(b)) - Number(isAvailable(a));
        if (avail !== 0) return avail;
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'name') return a.name.localeCompare(b.name);
        return (
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
          a.name.localeCompare(b.name)
        );
      })
  );

  const hasProducts = $derived(data.products.length > 0);
  const promo = $derived(data.siteSettings?.promoBanner);
  const orderingPaused = $derived(data.siteSettings != null && !data.siteSettings.orderingEnabled);

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
    toastStore.push(`${p.name} added to cart`, 'success');
  }

  function clearFilters() {
    query = '';
    activeCategory = 'All';
  }
</script>

<Seo
  title="Shop | {SITE_NAME}"
  canonical="/shop"
  description="Browse the Rainbow International Market catalogue — African, Caribbean, Asian and international groceries for cash-on-pickup in San Angelo, TX."
/>

{#if promo?.enabled}
  <div class="bg-orange px-6 py-2.5 text-center text-deep">
    <p class="type-caption font-semibold">
      {promo.headline}{#if promo.subtext}<span class="font-normal"> — {promo.subtext}</span>{/if}
    </p>
  </div>
{/if}

<Section tone="cream" class="!py-10 sm:!py-12">
  <header class="max-w-2xl">
    <p class="type-overline text-green">San Angelo, TX</p>
    <h1 class="mt-2 text-3xl font-semibold text-green sm:text-4xl">Shop the catalogue</h1>
    <p class="type-body mt-3 text-deep/70">
      Reserve online and pay cash when you collect. Prepared dishes are cooked to order.
    </p>
  </header>

  {#if orderingPaused}
    <div class="mt-6">
      <Badge tone="orange">Online ordering is paused</Badge>
      <span class="type-caption ml-2 text-deep/60">You can still browse — checkout is temporarily unavailable.</span>
    </div>
  {/if}

  <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
    <div class="sm:max-w-xs sm:flex-1">
      <Input
        type="search"
        ariaLabel="Search the catalogue"
        placeholder="Search products"
        rounded="2xl"
        bind:value={query}
      />
    </div>
    <div class="sm:w-56">
      <Select options={sortOptions} bind:value={sort} ariaLabel="Sort products" />
    </div>
  </div>

  {#if chips.length > 1}
    <div class="mt-4 flex flex-wrap gap-2">
      {#each chips as chip (chip.slug)}
        <button
          type="button"
          onclick={() => (activeCategory = chip.slug)}
          class={cn(
            'type-caption rounded-control border-2 px-4 py-2 font-semibold transition-colors',
            activeCategory === chip.slug
              ? 'border-green bg-green text-cream'
              : 'border-deep/20 text-deep hover:border-deep'
          )}
        >
          {chip.title}
        </button>
      {/each}
    </div>
  {/if}

  <div class="mt-8">
    {#if filteredProducts.length === 0}
      {#if !hasProducts}
        <EmptyState
          message="No products yet"
          hint="The catalogue is being stocked. Check back soon."
        />
      {:else}
        <EmptyState message={'Nothing matches "' + query + '"'} hint="Try a different search or category.">
          <Button variant="secondary" size="sm" onclick={clearFilters}>Clear filters</Button>
        </EmptyState>
      {/if}
    {:else}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each filteredProducts as product (product._id)}
          <a
            href={product.slug ? `/shop/${product.slug}` : undefined}
            class="block rounded-surface transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
          >
            <MenuItemCard
              layout="stack"
              name={product.name}
              description={firstLine(product.description)}
              price={formatCents(product.price)}
              image={cardImage(product)}
              imageAlt={product.name}
              tags={product.type === 'prepared' ? ['Made to order'] : []}
              soldOut={!isAvailable(product)}
              disabled={orderingPaused}
              actionLabel="Add"
              onAdd={() => addToCart(product)}
            />
          </a>
        {/each}
      </div>
    {/if}
  </div>
</Section>

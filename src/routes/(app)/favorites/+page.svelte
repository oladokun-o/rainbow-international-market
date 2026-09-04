<script lang="ts">
  import { onMount } from 'svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import MenuItemCard from '$lib/components/ui/MenuItemCard.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import { client, productsBySlugsQuery, firstLine, urlFor } from '$lib/sanity';
  import type { Product } from '$lib/sanity';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { cart } from '$lib/stores/cart.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { formatCents } from '$lib/utils';
  import { SITE_NAME } from '$lib/constants/site';

  // Re-validated products, keyed by slug — the saved list is only a hint.
  let live = $state<Product[]>([]);
  let loading = $state(true);
  let removedSome = $state(false);

  const isAvailable = (p: Product) => p.inStock !== false;

  onMount(async () => {
    const slugs = favorites.items.map((f) => f.slug).filter((s): s is string => !!s);
    if (slugs.length === 0) {
      loading = false;
      return;
    }
    try {
      const found = await client.fetch<Product[]>(productsBySlugsQuery, { slugs });
      const foundSlugs = new Set(found.map((p) => p.slug));
      // Drop favorites whose product no longer exists.
      const stillValid = favorites.items.filter((f) => f.slug && foundSlugs.has(f.slug));
      removedSome = stillValid.length !== favorites.items.length;
      if (removedSome) favorites.replace(stillValid);
      // Preserve saved order (newest first).
      const bySlug = new Map(found.map((p) => [p.slug, p]));
      live = favorites.items
        .map((f) => (f.slug ? bySlug.get(f.slug) : undefined))
        .filter((p): p is Product => !!p);
    } catch {
      // Offline / fetch failed — fall back to the cached list as plain cards.
      live = [];
    } finally {
      loading = false;
    }
  });

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
</script>

<Seo noindex title="Favorites | {SITE_NAME}" canonical="/favorites" />

<Section tone="cream" class="!py-10 sm:!py-12">
  <header class="max-w-2xl">
    <p class="type-overline text-green">Saved on this device</p>
    <h1 class="mt-2 text-3xl font-semibold text-green sm:text-4xl">Your favorites</h1>
  </header>

  <div class="mt-8">
    {#if loading}
      <p class="type-body text-deep/60">Loading…</p>
    {:else if favorites.count === 0}
      <EmptyState message="No favorites yet" hint="Tap the heart on any product to save it here.">
        <Button href="/shop" size="sm">Browse the catalogue</Button>
      </EmptyState>
    {:else}
      {#if removedSome}
        <p class="type-caption mb-4 text-deep/60">
          Some saved items are no longer available and have been removed.
        </p>
      {/if}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each live as product (product._id)}
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
              actionLabel="Add"
              onAdd={() => addToCart(product)}
              favorited={favorites.has(product._id)}
              onFavorite={() => favorites.toggle(product)}
            />
          </a>
        {/each}
      </div>
    {/if}
  </div>
</Section>

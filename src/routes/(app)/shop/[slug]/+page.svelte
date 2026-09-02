<script lang="ts">
  import { PortableText } from '@portabletext/svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import QuantityStepper from '$lib/components/ui/QuantityStepper.svelte';
  import PhotoPlaceholder from '$lib/components/ui/PhotoPlaceholder.svelte';
  import { formatCents } from '$lib/utils';
  import { urlFor, firstLine } from '$lib/sanity';
  import { cart } from '$lib/stores/cart.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { SITE_NAME } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
  const product = $derived(data.product);

  const available = $derived(product.inStock !== false);
  const onSale = $derived(
    typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price
  );

  let qty = $state(1);
  let selectedImage = $state(0);

  const images = $derived(product.images ?? []);

  function imageUrl(index: number, width: number): string | undefined {
    const src = images[index];
    if (!src) return undefined;
    try {
      return urlFor(src).width(width).url();
    } catch {
      return undefined;
    }
  }

  const mainImage = $derived(imageUrl(selectedImage, 900));

  const crumbs = $derived([
    { label: 'Shop', href: '/shop' },
    ...(product.category?.title
      ? [
          {
            label: product.category.title,
            href: product.category.slug ? `/shop?category=${product.category.slug}` : undefined
          }
        ]
      : []),
    { label: product.name }
  ]);

  function addToCart() {
    if (!available) return;
    cart.add(product, qty);
    toastStore.push(`Added ${qty} × ${product.name} to cart`, 'success');
  }
</script>

<Seo
  title="{product.name} | {SITE_NAME}"
  canonical={product.slug ? `/shop/${product.slug}` : '/shop'}
  description={firstLine(product.description) ??
    `${product.name} at Rainbow International Market, San Angelo, TX.`}
/>

<Section tone="cream" class="!py-10 sm:!py-12">
  <Breadcrumbs items={crumbs} class="mb-8" />

  <div class="grid gap-10 lg:grid-cols-2">
    <!-- Gallery -->
    <div>
      <div class="aspect-4/3 overflow-hidden rounded-surface bg-white/40">
        {#if mainImage}
          <img src={mainImage} alt={product.name} class="size-full object-cover" />
        {:else}
          <PhotoPlaceholder label="Product photo" class="size-full" />
        {/if}
      </div>
      {#if images.length > 1}
        <div class="mt-3 flex flex-wrap gap-3">
          {#each images as _img, i (i)}
            <button
              type="button"
              onclick={() => (selectedImage = i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={selectedImage === i}
              class="size-16 overflow-hidden rounded-control border-2 transition-colors {selectedImage === i
                ? 'border-green'
                : 'border-deep/15 hover:border-deep/40'}"
            >
              {#if imageUrl(i, 120)}
                <img src={imageUrl(i, 120)} alt="" class="size-full object-cover" />
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Details -->
    <div>
      {#if product.category?.title}
        <Badge tone="green" size="sm">{product.category.title}</Badge>
      {/if}
      <h1 class="mt-3 text-3xl font-semibold text-deep">{product.name}</h1>
      {#if product.unit}
        <p class="type-caption mt-1 text-deep/60">{product.unit}</p>
      {/if}

      <div class="mt-4 flex items-baseline gap-3">
        <span class="font-display text-2xl text-green">{formatCents(product.price)}</span>
        {#if onSale}
          <span class="text-deep/40 line-through">{formatCents(product.compareAtPrice as number)}</span>
        {/if}
      </div>

      {#if product.description}
        <div class="mt-6 space-y-3 text-[15px] leading-relaxed text-deep/80">
          <PortableText value={product.description as never} />
        </div>
      {/if}

      {#if product.type === 'prepared' && product.leadTimeNote}
        <p class="mt-5 rounded-surface bg-orange/15 px-4 py-3 text-[14px] font-medium text-deep">
          {product.leadTimeNote}
        </p>
      {/if}

      <div class="mt-8">
        {#if available}
          <div class="flex flex-wrap items-center gap-4">
            <QuantityStepper bind:value={qty} min={1} max={99} />
            <Button onclick={addToCart}>Add to cart</Button>
          </div>
          {#if data.siteSettings && !data.siteSettings.orderingEnabled}
            <p class="type-caption mt-3 text-deep/60">
              Checkout is paused right now, but you can still build your cart.
            </p>
          {/if}
        {:else}
          <Badge tone="deep">Currently unavailable</Badge>
        {/if}
      </div>
    </div>
  </div>
</Section>

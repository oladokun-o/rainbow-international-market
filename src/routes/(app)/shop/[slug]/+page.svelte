<script lang="ts">
  import { PortableText } from '@portabletext/svelte';
  import { Heart } from '@lucide/svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import QuantityStepper from '$lib/components/ui/QuantityStepper.svelte';
  import PhotoPlaceholder from '$lib/components/ui/PhotoPlaceholder.svelte';
  import MenuItemCard from '$lib/components/ui/MenuItemCard.svelte';
  import Accordion from '$lib/components/ui/Accordion.svelte';
  import { formatCents } from '$lib/utils';
  import { urlFor, firstLine, type Product } from '$lib/sanity';
  import { cart } from '$lib/stores/cart.svelte';
  import { favorites } from '$lib/stores/favorites.svelte';
  import { toastStore } from '$lib/stores/toast.svelte';
  import { SITE_NAME } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
  const product = $derived(data.product);
  const isFavorited = $derived(favorites.has(product._id));

  async function shareProduct() {
    const url = typeof location !== 'undefined' ? location.href : '';
    const shareData = { title: product.name, text: `${product.name} — ${SITE_NAME}`, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      toastStore.push('Link copied', 'success');
    } catch {
      /* user dismissed the share sheet, or clipboard denied — no-op */
    }
  }

  const available = $derived(product.inStock !== false);
  const onSale = $derived(
    typeof product.compareAtPrice === 'number' && product.compareAtPrice > product.price
  );
  const metaLine = $derived([product.origin, product.brand].filter(Boolean).join(' · '));

  let qty = $state(1);
  let selectedImage = $state(0);
  const total = $derived(product.price * qty);

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

  function relatedImage(p: Product): string | undefined {
    const first = p.images?.[0];
    if (!first) return undefined;
    try {
      return urlFor(first).width(400).height(300).fit('crop').url();
    } catch {
      return undefined;
    }
  }

  function addRelatedToCart(p: Product) {
    cart.add(p, 1);
    toastStore.push(`${p.name} added to cart`, 'success');
  }

  // Sticky mobile add-to-cart bar: shown once the inline quantity card
  // scrolls out of view, so we don't double-show the CTA on screen.
  let qtyCardEl = $state<HTMLDivElement | null>(null);
  let showStickyBar = $state(false);

  $effect(() => {
    if (!qtyCardEl || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      showStickyBar = !entry.isIntersecting;
    });
    observer.observe(qtyCardEl);
    return () => observer.disconnect();
  });
</script>

<Seo
  title="{product.name} | {SITE_NAME}"
  canonical={product.slug ? `/shop/${product.slug}` : '/shop'}
  description={firstLine(product.description) ??
    `${product.name} at Rainbow International Market, San Angelo, TX.`}
/>

<Section tone="cream" class="!py-10 sm:!py-12">
  <div class="mb-8 flex items-center justify-between gap-3">
    <Breadcrumbs items={crumbs} />
    <div class="flex shrink-0 items-center gap-1.5">
      <IconButton icon="share" label="Share this product" variant="outline" onclick={shareProduct} />
      <button
        type="button"
        onclick={() => favorites.toggle(product)}
        aria-pressed={isFavorited}
        aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
        class="grid size-9 shrink-0 place-items-center rounded-control border-2 transition-colors duration-normal {isFavorited
          ? 'border-orange text-orange'
          : 'border-deep/20 text-deep hover:border-deep'}"
      >
        <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
      </button>
    </div>
  </div>

  <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
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
    <div class="lg:sticky lg:top-24 lg:self-start">
      <div class="flex flex-wrap items-center gap-2">
        {#if product.category?.title}
          <Badge tone="green" size="sm">{product.category.title}</Badge>
        {/if}
        {#if available}
          <Badge tone="success" size="sm">In stock</Badge>
        {/if}
      </div>
      <h1 class="mt-3 text-3xl font-semibold text-deep">{product.name}</h1>
      {#if product.unit}
        <p class="type-caption mt-1 text-deep/60">{product.unit}</p>
      {/if}
      {#if metaLine}
        <p class="type-caption mt-1 text-deep/60">{metaLine}</p>
      {/if}

      <div class="mt-4 flex flex-wrap items-baseline gap-3">
        <span class="font-display text-2xl text-green">{formatCents(product.price)}</span>
        {#if onSale}
          <span class="text-deep/40 line-through">{formatCents(product.compareAtPrice as number)}</span>
        {/if}
        <span class="type-caption text-deep/60">(pay cash at pickup)</span>
      </div>

      {#if product.description}
        <div class="mt-6 space-y-3 text-[15px] leading-relaxed text-deep/80">
          <PortableText value={product.description as never} />
        </div>
      {/if}

      <p class="mt-5 rounded-surface bg-yellow/15 px-4 py-3 text-[14px] font-medium text-deep">
        Cash on pickup — pay when you collect in store. No card needed.
      </p>

      {#if product.type === 'prepared' && product.leadTimeNote}
        <p class="mt-3 rounded-surface bg-orange/15 px-4 py-3 text-[14px] font-medium text-deep">
          {product.leadTimeNote}
        </p>
      {/if}

      <div class="mt-6">
        {#if available}
          <div
            bind:this={qtyCardEl}
            class="rounded-surface border-2 border-deep/10 bg-white/50 p-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-[15px] font-semibold text-deep">Select quantity</span>
              <span class="type-caption text-deep/60">{formatCents(product.price)} each</span>
            </div>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <QuantityStepper bind:value={qty} min={1} max={99} />
              <Button class="flex-1" onclick={addToCart}>
                Add to cart · {formatCents(total)}
              </Button>
            </div>
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

      <Accordion
        class="mt-6"
        items={[{ id: 'pickup', label: 'How pickup works' }]}
      >
        {#snippet content()}
          <ol class="space-y-3">
            <li class="flex gap-3">
              <span
                class="grid size-6 shrink-0 place-items-center rounded-full bg-green/10 text-[13px] font-semibold text-green"
              >
                1
              </span>
              <div>
                <p class="text-[14px] font-semibold text-deep">Reserve online</p>
                <p class="type-caption text-deep/60">Submit your cart — no payment due now.</p>
              </div>
            </li>
            <li class="flex gap-3">
              <span
                class="grid size-6 shrink-0 place-items-center rounded-full bg-green/10 text-[13px] font-semibold text-green"
              >
                2
              </span>
              <div>
                <p class="text-[14px] font-semibold text-deep">We confirm</p>
                <p class="type-caption text-deep/60">We'll email you when your order is ready.</p>
              </div>
            </li>
            <li class="flex gap-3">
              <span
                class="grid size-6 shrink-0 place-items-center rounded-full bg-green/10 text-[13px] font-semibold text-green"
              >
                3
              </span>
              <div>
                <p class="text-[14px] font-semibold text-deep">Collect &amp; pay cash</p>
                <p class="type-caption text-deep/60">Pick up in San Angelo — no card needed.</p>
              </div>
            </li>
          </ol>
        {/snippet}
      </Accordion>
    </div>
  </div>

  {#if data.relatedProducts.length > 0}
    <div class="mt-14">
      <h2 class="mb-4 text-xl font-semibold text-deep">You might also like</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {#each data.relatedProducts as related (related._id)}
          <a href="/shop/{related.slug}">
            <MenuItemCard
              layout="stack"
              name={related.name}
              price={formatCents(related.price)}
              image={relatedImage(related)}
              imageAlt={related.name}
              soldOut={related.inStock === false}
              actionLabel="Add"
              onAdd={() => addRelatedToCart(related)}
            />
          </a>
        {/each}
      </div>
    </div>
  {/if}
</Section>

{#if available}
  <div
    class="fixed inset-x-0 bottom-0 z-20 border-t-2 border-deep/10 bg-cream/95 px-4 pt-3 backdrop-blur-sm transition-opacity duration-normal sm:hidden {showStickyBar
      ? 'opacity-100'
      : 'pointer-events-none opacity-0'}"
    style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem)"
    aria-hidden={!showStickyBar}
  >
    <div class="mx-auto flex max-w-lg items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="type-caption text-deep/60">Total (pay in cash)</p>
        <p class="font-display text-lg text-green">{formatCents(total)}</p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <QuantityStepper bind:value={qty} min={1} max={99} size="sm" />
        <Button size="sm" onclick={addToCart}>Add to cart</Button>
      </div>
    </div>
  </div>
{/if}

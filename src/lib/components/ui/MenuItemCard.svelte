<script lang="ts">
  import { Heart } from '@lucide/svelte';
  import { cn } from '$lib/utils';
  import Card from './Card.svelte';
  import Badge from './Badge.svelte';
  import Button from './Button.svelte';
  import PhotoPlaceholder from './PhotoPlaceholder.svelte';

  /** A single product: image slot, name, description, price, tags, add action.
   * (Phase 4 uses this as the storefront product card.)
   *
   * layout — 'stack' (default): full-width photo on top, content below. For
   * browsing contexts with no action where the photo is the point.
   * 'row': square photo left, content right, price + Add button on one
   * line — the ordering grid's own layout, denser and built around the
   * action, not the photo. Only from `sm:` up; below that a flush
   * left-photo/right-text row leaves the text column too narrow, so it falls
   * back to a photo-on-top column, same shape as 'stack'. */
  interface Props {
    name: string;
    description?: string;
    /** Pre-formatted price string, e.g. "$14.00". */
    price: string;
    /** Short merchandising labels, rendered as green badges. */
    tags?: string[];
    /** Product photo URL. Leave empty for the placeholder slot. */
    image?: string;
    imageAlt?: string;
    layout?: 'stack' | 'row';
    actionLabel?: string;
    onAdd?: () => void;
    /** When passed, renders a heart toggle overlaid on the image. */
    onFavorite?: () => void;
    favorited?: boolean;
    disabled?: boolean;
    soldOut?: boolean;
    class?: string;
  }

  let {
    name,
    description,
    price,
    tags = [],
    image,
    imageAlt = '',
    layout = 'stack',
    actionLabel = 'Add',
    onAdd,
    onFavorite,
    favorited = false,
    disabled = false,
    soldOut = false,
    class: className
  }: Props = $props();

  // The card is often wrapped in a link to the product page; keep an Add
  // click from also triggering that navigation.
  function handleAdd(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onAdd?.();
  }

  function handleFavorite(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onFavorite?.();
  }
</script>

{#snippet favoriteButton()}
  {#if onFavorite}
    <button
      type="button"
      onclick={handleFavorite}
      aria-pressed={favorited}
      aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
      class="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full bg-white/90 text-deep shadow-sm transition-transform hover:bg-white active:scale-95"
    >
      <Heart size={16} fill={favorited ? 'currentColor' : 'none'} class={favorited ? 'text-orange' : ''} />
    </button>
  {/if}
{/snippet}

{#if layout === 'row'}
  <Card
    padding="none"
    class={cn(
      'overflow-hidden border-none bg-white/40',
      soldOut && 'opacity-60 saturate-[0.35]',
      className
    )}
  >
    <div class="flex flex-col gap-4 sm:min-h-32 sm:flex-row">
      <div
        class="relative aspect-4/3 w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-28 sm:self-stretch"
      >
        {#if image}
          <img src={image} alt={imageAlt} class="size-full object-cover" loading="lazy" />
        {:else}
          <PhotoPlaceholder label="Product photo" class="size-full" />
        {/if}
        {#if tags.length > 0}
          <div class="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {#each tags as tag (tag)}
              <Badge tone="green" size="sm">{tag}</Badge>
            {/each}
          </div>
        {/if}
        {@render favoriteButton()}
      </div>
      <div class="flex min-w-0 flex-1 flex-col justify-between p-4 sm:py-4 sm:pr-4 sm:pl-0">
        <div class="min-w-0">
          <p class="truncate text-[15px] font-semibold text-deep">{name}</p>
          {#if description}
            <p class="type-caption mt-0.5 truncate text-deep/50">{description}</p>
          {/if}
        </div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <span class="text-[16px] font-display text-green">{price}</span>
          {#if onAdd}
            <Button size="sm" disabled={disabled || soldOut} onclick={handleAdd}>
              {soldOut ? 'Sold out' : actionLabel}
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </Card>
{:else}
  <Card
    padding="none"
    class={cn(
      'overflow-hidden',
      soldOut && 'opacity-60 saturate-[0.35]',
      className,
      'border-none bg-transparent'
    )}
  >
    <div class="relative aspect-4/3 w-full overflow-hidden rounded-surface">
      {#if image}
        <img src={image} alt={imageAlt} class="size-full object-cover" loading="lazy" />
      {:else}
        <PhotoPlaceholder label="Product photo" class="size-full" />
      {/if}
      {#if tags.length > 0}
        <div class="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {#each tags as tag (tag)}
            <Badge tone="green" size="sm">{tag}</Badge>
          {/each}
        </div>
      {/if}
      {#if soldOut}
        <span class={cn('animate-fade-up absolute right-2', onFavorite ? 'top-11' : 'top-2')}>
          <Badge tone="deep" size="sm">Sold out</Badge>
        </span>
      {/if}
      {@render favoriteButton()}
    </div>
    <div class="flex flex-col py-2">
      <p class="text-[14px] font-semibold text-deep">{name}</p>
      <div class="flex items-center justify-between gap-3">
        <span class="font-display text-[16px] text-green">{price}</span>
        {#if onAdd}
          <Button size="sm" disabled={disabled || soldOut} onclick={onAdd}>
            {soldOut ? 'Sold out' : actionLabel}
          </Button>
        {/if}
      </div>
    </div>
  </Card>
{/if}

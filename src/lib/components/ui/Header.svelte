<script lang="ts">
  import type { Snippet } from 'svelte';
  import { scale } from 'svelte/transition';
  import { cn } from '$lib/utils';
  import Logo from '../brand/Logo.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import { ORDER_HREF } from '$lib/constants/site';
  import Hamburger from './Hamburger.svelte';

  /**
   * One site shell, reused by every page. Layout follows two distinct
   * arrangements, not one scaled down: mobile is hamburger (left) / logo
   * (center) / CTA (right); desktop is logo (left) / nav (true center) / CTA
   * (right). A 3-column grid carries both — each column swaps its mobile vs.
   * desktop child via `sm:hidden` / `hidden sm:flex` rather than reflowing,
   * so the middle column is genuinely centered on the header's full width
   * regardless of whether the outer columns have equal content (a flex
   * `justify-between` with an empty side does NOT center the middle item —
   * this does).
   */
  interface Props {
    /** Rendered only when passed. */
    location?: string;
    /** Shows a "· Closed" suffix on the location chip — hidden below `sm:`
     * so the chip stays short/legible on mobile (name only there). */
    locationClosed?: boolean;
    onLocationClick?: () => void;
    /** Defaults to the site-wide `ORDER_HREF` switch — pass `null` to force-hide
     * the CTA on a specific page, or a specific string to override where it
     * points. */
    orderHref?: string | null;
    /** Off when a caller renders more sticky chrome directly below and wants
     * one shadow at the bottom of the whole stack instead of one splitting
     * header from the chrome below. `scrolled` is bindable either way. */
    shadow?: boolean;
    scrolled?: boolean;
    class?: string;
    /** Extra nav links/content between the logo and the location chip. */
    nav?: Snippet;
    /** When set, shows a cart link; the badge appears once `cartCount` > 0. */
    cartHref?: string;
    cartCount?: number;
  }

  let {
    location,
    locationClosed = false,
    onLocationClick,
    orderHref = ORDER_HREF,
    shadow = true,
    scrolled = $bindable(false),
    class: className,
    nav,
    cartHref,
    cartCount = 0
  }: Props = $props();

  let mobileMenuOpen = $state(false);

  // The shadow/border only appears once the page has actually scrolled —
  // floating chrome shouldn't look separated from the hero underneath it
  // before there's anything to scroll past.

  $effect(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 4;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<header
  class={cn(
    'sticky top-0 z-20 bg-cream/90 px-6 py-4 backdrop-blur-sm transition-shadow duration-fast lg:px-12',
    scrolled && shadow ? 'shadow-sm' : '',
    className
  )}
>
  <div class="relative mx-auto grid max-w-6xl grid-cols-3 lg:grid-cols-3 items-center gap-0">
    <!-- Column 1: hamburger on mobile, logo on desktop -->
    <div class="justify-self-start">
      <Logo variant="mark" height={28} href="/" class="sm:hidden" imgClass="h-7 w-auto" />
      <Logo variant="wordmark" height={64} href="/" class="hidden sm:block" imgClass="h-7 w-auto sm:h-12" />
    </div>

    <!-- Column 2: nav on desktop (true center) -->
    <div class="hidden lg:flex justify-self-center">
      {#if nav}
        <nav class="items-center gap-3 flex gap-6">
          {@render nav()}
        </nav>
      {/if}
    </div>

    <!-- Column 3: location chip (desktop only) + CTA, always right-aligned -->
    <div class="flex items-center justify-self-end gap-2 sm:gap-3 col-span-2 sm:col-span-1">
      {#if location}
        <button
          type="button"
          onclick={onLocationClick}
          class="items-center gap-1.5 rounded-control border-2 border-deep/20 px-3 py-1.5 type-caption font-semibold text-deep transition-colors hover:border-deep flex"
        >
          <Icon name="map-pin" class="text-green" />
          {location}{#if locationClosed}<span class="hidden sm:inline"> · Closed</span>{/if}
          <Icon name="chevron-down" size={14} />
        </button>
      {/if}
      {#if orderHref}
        <Button size="sm" class="hidden md:inline-flex" href={orderHref}>Shop</Button>
      {/if}
      {#if cartHref}
        <a
          href={cartHref}
          class="relative flex size-9 items-center justify-center rounded-control border-2 border-deep/20 text-deep transition-colors hover:border-deep"
          aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Cart'}
        >
          <Icon name="cart" size={16} />
          {#if cartCount > 0}
            <span
              class="absolute -right-1.5 -top-1.5 grid min-w-[1.1rem] place-items-center rounded-full bg-green px-1 text-[11px] font-bold text-cream"
            >
              {cartCount}
            </span>
          {/if}
        </a>
      {/if}
      {#if nav}
        <Hamburger
          onMenuClick={() => (mobileMenuOpen = !mobileMenuOpen)}
          mobileMenuState={mobileMenuOpen}
        />
      {/if}
    </div>
  </div>

  {#if nav && mobileMenuOpen}
    <div
      transition:scale={{ duration: 200, start: 0.95, opacity: 0 }}
      class="absolute inset-x-6 top-full z-50 mt-3 rounded-surface border-2 border-deep/10 bg-cream px-8 py-10 text-center shadow-2xl sm:hidden"
      style="transform-origin: top;"
    >
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
      <div
        role="navigation"
        aria-label="Main"
        class="flex flex-col items-center gap-6"
        onclick={() => (mobileMenuOpen = false)}
      >
        {@render nav()}
      </div>
      {#if orderHref}
        <Button href={orderHref} class="mt-8 w-full" onclick={() => (mobileMenuOpen = false)}>
          Shop
        </Button>
      {/if}
    </div>
  {/if}
</header>

{#if nav && mobileMenuOpen}
  <!-- Transparent click-outside catcher — sibling of <header>, not a
       descendant: header's own backdrop-blur makes it a containing block
       for fixed/absolute descendants, which would confine "fixed inset-0"
       to the header's own small box instead of the full viewport. Must
       stay BELOW header's own stacking context (header has z-20, which
       applies to the whole header subtree including the menu's z-50) —
       a sibling z-index is compared against that context as a unit, so
       z-40 here previously painted over the entire header, menu links
       included, swallowing every click before it reached them. -->
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <div
    class="fixed inset-0 z-10 sm:hidden"
    onclick={() => (mobileMenuOpen = false)}
    aria-hidden="true"
  ></div>
{/if}

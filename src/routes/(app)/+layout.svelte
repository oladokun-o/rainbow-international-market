<script lang="ts">
  // Storefront shell — every marketing/shop route gets the Header + Footer.
  // The Studio (/studio) and other top-level routes stay outside this group.
  import type { Snippet } from "svelte";
  import Header from "$lib/components/ui/Header.svelte";
  import Footer from "$lib/components/ui/Footer.svelte";
  import BottomNav from "$lib/components/ui/BottomNav.svelte";
  import MotifBand from "$lib/components/ui/MotifBand.svelte";
  import { PRIMARY_LOCATION, MARKETING_NAV } from "$lib/constants/site";
  import { cart } from "$lib/stores/cart.svelte";
  import { favorites } from "$lib/stores/favorites.svelte";

  const { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-dvh flex-col bg-cream pb-20 sm:pb-0">
  <Header
    location={PRIMARY_LOCATION.name}
    cartHref="/cart"
    cartCount={cart.count}
    favoritesHref="/favorites"
    favoritesCount={favorites.count}
  >
    {#snippet nav()}
      {#each MARKETING_NAV as link (link.href)}
        <a
          href={link.href}
          class="type-caption font-semibold text-deep transition-colors hover:text-green"
        >
          {link.label}
        </a>
      {/each}
    {/snippet}
  </Header>
  <!-- <MotifBand /> -->
  {@render children()}
  <Footer />
  <BottomNav />
</div>

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Icon from './Icon.svelte';
  import { cn } from '$lib/utils';
  import { cart } from '$lib/stores/cart.svelte';
  import { getActiveOrders } from '$lib/stores/savedOrders';

  /** Primary mobile destinations only — everything else stays in the
   * hamburger. Hidden entirely above `sm:` (desktop keeps the header nav +
   * header heart/cart icons instead). */
  const TABS = [
    { href: '/', label: 'Home', icon: 'home' as const },
    { href: '/shop', label: 'Shop', icon: 'grid' as const },
    { href: '/cart', label: 'Cart', icon: 'cart' as const },
    { href: '/my-orders', label: 'Orders', icon: 'file' as const }
  ];

  let hasActiveOrder = $state(false);

  function refreshActiveOrder() {
    hasActiveOrder = getActiveOrders().length > 0;
  }

  onMount(() => {
    refreshActiveOrder();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshActiveOrder();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  });

  // Slide the bar off-screen while the user is actively scrolling down (more
  // page to read), bring it back on the way up or once they're back near the
  // top — same pattern as most native app tab bars. A small threshold on
  // both the scroll distance and the near-top zone keeps it from flickering
  // on tiny rubber-band bounces.
  let scrollHidden = $state(false);

  onMount(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y <= 16) {
        scrollHidden = false;
      } else if (delta > 8) {
        scrollHidden = true;
      } else if (delta < -8) {
        scrollHidden = false;
      }
      lastY = y;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  const isCurrent = (href: string) =>
    href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

  // Product pages get their own sticky add-to-cart bar instead of this nav —
  // two stacked fixed bars is too much chrome for one screen.
  const onProductPage = $derived(/^\/shop\/[^/]+\/?$/.test(page.url.pathname));
</script>

<nav
  hidden={onProductPage}
  inert={scrollHidden}
  aria-label="Primary"
  class={cn(
    'fixed inset-x-0 bottom-0 z-20 border-t-2 border-deep/10 bg-cream/95 backdrop-blur-sm transition-transform duration-normal sm:hidden',
    scrollHidden && 'translate-y-full'
  )}
  style="padding-bottom: env(safe-area-inset-bottom)"
>
  <ul class="mx-auto grid max-w-lg grid-cols-4">
    {#each TABS as tab (tab.href)}
      {@const current = isCurrent(tab.href)}
      <li>
        <a
          href={tab.href}
          aria-current={current ? 'page' : undefined}
          class={cn(
            'flex flex-col items-center gap-1 py-2.5 transition-colors',
            current ? 'text-green' : 'text-deep/55'
          )}
        >
          <span class="relative">
            <Icon name={tab.icon} size={20} />
            {#if tab.href === '/cart' && cart.count > 0}
              <span
                class="absolute -right-2 -top-1.5 grid min-w-[1rem] place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white"
              >
                {cart.count}
              </span>
            {/if}
            {#if tab.href === '/my-orders' && hasActiveOrder}
              <span
                class="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-orange"
                aria-hidden="true"
              ></span>
            {/if}
          </span>
          <span class="type-caption text-[11px] font-semibold">{tab.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

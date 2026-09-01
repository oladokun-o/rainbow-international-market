<script lang="ts">
  import { cn } from '$lib/utils';
  import Logo from '../brand/Logo.svelte';
  import {
    SITE_NAME,
    SOCIAL_LINKS,
    PRIMARY_LOCATION,
    MARKETING_NAV,
    PRODUCT_CATEGORIES
  } from '$lib/constants/site';

  /**
   * One site shell footer, reused by every page — three plain-text columns
   * on cream: explore links, shop categories, opening hours, with socials as
   * text links. No map, no dark background.
   */
  interface Props {
    class?: string;
  }

  let { class: className }: Props = $props();

  const socials = [
    { label: 'Instagram', href: SOCIAL_LINKS.instagram },
    { label: 'TikTok', href: SOCIAL_LINKS.tiktok },
    { label: 'Facebook', href: SOCIAL_LINKS.facebook }
  ].filter((s) => s.href);

  const columns = [
    {
      heading: 'Explore',
      links: [...MARKETING_NAV]
    }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' }
  ];

  const year = new Date().getFullYear();
</script>

<footer class={cn('px-6 pt-10 sm:px-12', className)}>
  <div class="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
    <div>
      <Logo tone="green" height={28} href="/" imgClass="h-6 w-auto" />
      <p class="font-display mt-3 text-sm uppercase tracking-wide text-green">
        African, Caribbean, Asian &amp; international groceries.
      </p>
      {#if socials.length > 0}
        <div class="mt-4 flex gap-4">
          {#each socials as social (social.href)}
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow {SITE_NAME} on {social.label}"
              class="type-caption font-semibold text-deep transition-colors hover:text-green"
            >
              {social.label}
            </a>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex flex-wrap gap-y-10 sm:gap-y-16 md:w-full lg:w-1/2">
      {#each columns as column (column.heading)}
        <div class="flex flex-col gap-3 w-1/2 sm:w-[33.3%]">
          <p class="type-caption font-semibold text-deep/50 capitalize">{column.heading}</p>
          {#each column.links as link (link.href)}
            <a
              href={link.href}
              class="type-caption font-semibold text-deep transition-colors hover:text-green"
            >
              {link.label}
            </a>
          {/each}
        </div>
      {/each}

      <div class="flex flex-col gap-3 w-1/2 sm:w-[33.3%]">
        <p class="type-caption font-semibold text-deep/50 capitalize">Shop</p>
        {#each PRODUCT_CATEGORIES as category (category.slug)}
          <a
            href="/shop#{category.slug}"
            class="type-caption font-semibold text-deep transition-colors hover:text-green"
          >
            {category.label}
          </a>
        {/each}
      </div>

      <div class="flex flex-col gap-3 sm:w-[33.3%]">
        <p class="type-caption font-semibold text-deep/50 capitalize">Opening Hours</p>
        <p class="type-caption font-semibold text-deep">
          Mon – Fri: {PRIMARY_LOCATION.hours.weekdays.display}
        </p>
        <p class="type-caption font-semibold text-deep">
          Sat: {PRIMARY_LOCATION.hours.saturday.display}
        </p>
        <p class="type-caption font-semibold text-deep">
          Sun: {PRIMARY_LOCATION.hours.sunday.display}
        </p>
      </div>
    </div>
  </div>

  <div
    class="mx-auto mt-8 flex max-w-6xl flex-wrap gap-4 border-t border-deep/10 py-6 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
      {#each legalLinks as link (link.href)}
        <a
          href={link.href}
          class="type-caption font-semibold text-deep/60 transition-colors hover:text-green"
        >
          {link.label}
        </a>
      {/each}
    </div>
    <span class="type-caption text-deep/60">English (US)</span>
    <p class="type-caption text-deep/60">© {year} {SITE_NAME}</p>
  </div>
</footer>

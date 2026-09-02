<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import Icon from '$lib/components/ui/Icon.svelte';
  import type { LayoutData } from './$types';

  const { data, children }: { data: LayoutData; children: Snippet } = $props();

  const isLogin = $derived(page.url.pathname === '/admin/login');

  const nav = [
    { label: 'Dashboard', href: '/admin', icon: 'grid' as const },
    { label: 'Orders', href: '/admin/orders', icon: 'list' as const }
  ];

  function active(href: string): boolean {
    return href === '/admin'
      ? page.url.pathname === '/admin'
      : page.url.pathname.startsWith(href);
  }
</script>

{#if isLogin}
  {@render children()}
{:else}
  <div class="flex min-h-dvh bg-cream text-deep">
    <aside class="flex w-56 shrink-0 flex-col border-r-2 border-deep/10 bg-white/40 p-4">
      <a href="/admin" class="font-display text-lg font-bold tracking-wide text-green">RAINBOW</a>
      <p class="type-caption mt-0.5 text-deep/50">Admin</p>

      <nav class="mt-6 flex flex-col gap-1">
        {#each nav as item (item.href)}
          <a
            href={item.href}
            class={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 type-caption font-semibold transition-colors',
              active(item.href) ? 'bg-green text-cream' : 'text-deep hover:bg-deep/5'
            )}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
          </a>
        {/each}
        <a
          href="/studio"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 rounded-lg px-3 py-2 type-caption font-semibold text-deep hover:bg-deep/5"
        >
          <Icon name="edit" size={15} />
          Products (Studio)
        </a>
      </nav>

      <div class="mt-auto border-t-2 border-deep/10 pt-3">
        {#if data.session}
          <p class="type-caption font-semibold text-deep">{data.session.name}</p>
          <p class="type-caption text-deep/50 capitalize">{data.session.role}</p>
        {/if}
        <form method="POST" action="/admin/logout" class="mt-2">
          <button type="submit" class="type-caption font-semibold text-green hover:text-deep">
            Sign out
          </button>
        </form>
      </div>
    </aside>

    <main class="min-w-0 flex-1 p-8">
      {@render children()}
    </main>
  </div>
{/if}

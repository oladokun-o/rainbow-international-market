<script lang="ts">
  import Badge from '$lib/components/ui/Badge.svelte';
  import { formatPickupDateLabel } from '$lib/pickup';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const statusCards = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'ready', label: 'Ready' },
    { key: 'collected', label: 'Collected' }
  ] as const;
</script>

<svelte:head><title>Dashboard — Rainbow Admin</title></svelte:head>

<h1 class="text-2xl font-semibold text-deep">Dashboard</h1>
<p class="type-caption mt-1 text-deep/50">{data.openCount} open orders</p>

<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
  {#each statusCards as card (card.key)}
    <div class="rounded-surface border-2 border-deep/10 bg-white/50 p-4">
      <p class="type-caption text-deep/50">{card.label}</p>
      <p class="mt-1 text-3xl font-semibold text-green">{data.byStatus[card.key]}</p>
    </div>
  {/each}
</div>

<section class="mt-10">
  <h2 class="font-semibold text-deep">Today's pickups</h2>
  {#if data.todaysPickups.length === 0}
    <p class="type-caption mt-2 text-deep/50">Nothing scheduled for pickup today.</p>
  {:else}
    <ul class="mt-3 flex list-none flex-col gap-2 p-0">
      {#each data.todaysPickups as order (order.orderRef)}
        <li
          class="flex items-center justify-between gap-3 rounded-surface border-2 border-deep/10 bg-white/50 px-4 py-3"
        >
          <div class="min-w-0">
            <a href="/admin/orders?ref={order.orderRef}" class="font-semibold text-green">
              {order.orderRef}
            </a>
            <span class="type-caption ml-2 text-deep/60">
              {order.customer?.name} · {order.items?.length ?? 0} items
            </span>
          </div>
          <Badge tone="outline" size="sm">{order.status}</Badge>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<section class="mt-10">
  <h2 class="font-semibold text-deep">Low stock</h2>
  {#if data.lowStock.length === 0}
    <p class="type-caption mt-2 text-deep/50">No products below their low-stock threshold.</p>
  {:else}
    <ul class="mt-3 flex list-none flex-col gap-1 p-0">
      {#each data.lowStock as p (p._id)}
        <li class="flex justify-between gap-3 type-caption">
          <span class="text-deep">{p.name}{p.unit ? ` (${p.unit})` : ''}</span>
          <span class="font-semibold text-green">
            {p.stockQty} left · threshold {p.lowStockThreshold}
          </span>
        </li>
      {/each}
    </ul>
  {/if}
</section>

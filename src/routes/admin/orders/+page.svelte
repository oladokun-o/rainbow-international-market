<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import Badge from '$lib/components/ui/Badge.svelte';
  import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
  import { formatCents } from '$lib/utils';
  import { formatPickupDateLabel } from '$lib/pickup';
  import type { PageData, ActionData } from './$types';

  const { data, form }: { data: PageData; form: ActionData } = $props();

  const statusTone: Record<string, 'outline' | 'warning' | 'progress' | 'success' | 'error'> = {
    pending: 'warning',
    confirmed: 'progress',
    ready: 'progress',
    collected: 'success',
    cancelled: 'error'
  };

  function withParam(key: string, value: string): string {
    const p = new URLSearchParams(page.url.searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete('page');
    return `?${p.toString()}`;
  }

  function pageLink(n: number): string {
    const p = new URLSearchParams(page.url.searchParams);
    p.set('page', String(n));
    return `?${p.toString()}`;
  }
</script>

<svelte:head><title>Orders — Rainbow Admin</title></svelte:head>

<div class="flex flex-wrap items-center justify-between gap-3">
  <h1 class="text-2xl font-semibold text-deep">Orders</h1>
  <a
    href="/admin/orders/export.csv{page.url.search}"
    class="type-caption rounded-control border-2 border-deep px-4 py-2 font-semibold text-deep hover:bg-deep hover:text-cream"
  >
    Export CSV
  </a>
</div>

<form method="GET" class="mt-5 flex flex-wrap items-end gap-3">
  <label class="flex flex-col gap-1 type-caption text-deep/60">
    Search
    <input
      name="q"
      value={data.filters.q}
      placeholder="Ref, name, phone"
      class="h-10 rounded-control border-2 border-deep/15 bg-white/60 px-3 text-[14px] text-deep"
    />
  </label>
  <label class="flex flex-col gap-1 type-caption text-deep/60">
    Status
    <select
      name="status"
      value={data.filters.status}
      class="h-10 rounded-control border-2 border-deep/15 bg-white/60 px-3 text-[14px] text-deep"
    >
      <option value="">All</option>
      {#each data.statuses as s (s)}<option value={s}>{s}</option>{/each}
    </select>
  </label>
  <label class="flex flex-col gap-1 type-caption text-deep/60">
    Pickup from
    <input
      name="from"
      type="date"
      value={data.filters.from}
      class="h-10 rounded-control border-2 border-deep/15 bg-white/60 px-3 text-[14px] text-deep"
    />
  </label>
  <label class="flex flex-col gap-1 type-caption text-deep/60">
    to
    <input
      name="to"
      type="date"
      value={data.filters.to}
      class="h-10 rounded-control border-2 border-deep/15 bg-white/60 px-3 text-[14px] text-deep"
    />
  </label>
  <button
    type="submit"
    class="h-10 rounded-control bg-green px-4 type-caption font-semibold text-cream"
  >
    Apply
  </button>
  {#if data.filters.q || data.filters.status || data.filters.from || data.filters.to}
    <a href="/admin/orders" class="type-caption font-semibold text-green">Clear</a>
  {/if}
</form>

{#if form?.error}
  <div class="mt-4"><StatusMessage tone="error">{form.error}</StatusMessage></div>
{/if}

<p class="type-caption mt-4 text-deep/50">{data.total} orders</p>

<div class="mt-2 overflow-x-auto">
  <table class="w-full border-collapse text-left text-[14px]">
    <thead>
      <tr class="type-caption text-deep/50">
        <th class="py-2 pr-4">Ref</th>
        <th class="py-2 pr-4">Customer</th>
        <th class="py-2 pr-4">Pickup</th>
        <th class="py-2 pr-4">Total</th>
        <th class="py-2 pr-4">Status</th>
        <th class="py-2">Update</th>
      </tr>
    </thead>
    <tbody>
      {#each data.orders as order (order._id)}
        <tr class="border-t border-deep/10 align-top">
          <td class="py-3 pr-4 font-semibold text-green">{order.orderRef}</td>
          <td class="py-3 pr-4 text-deep">
            {order.customer.name}
            <span class="block type-caption text-deep/50">{order.customer.phone}</span>
          </td>
          <td class="py-3 pr-4 text-deep">{formatPickupDateLabel(order.pickupDate)}</td>
          <td class="py-3 pr-4 text-deep">{formatCents(order.totalCents)}</td>
          <td class="py-3 pr-4">
            <Badge tone={statusTone[order.status] ?? 'outline'} size="sm">{order.status}</Badge>
          </td>
          <td class="py-3">
            <form method="POST" action="?/updateStatus" use:enhance class="flex gap-2">
              <input type="hidden" name="orderId" value={order._id} />
              <select
                name="status"
                class="h-9 rounded-control border-2 border-deep/15 bg-white/60 px-2 text-[13px] text-deep"
              >
                {#each data.statuses as s (s)}
                  <option value={s} selected={s === order.status}>{s}</option>
                {/each}
              </select>
              <button
                type="submit"
                class="h-9 rounded-control bg-deep px-3 text-[13px] font-semibold text-cream"
              >
                Save
              </button>
            </form>
          </td>
        </tr>
      {:else}
        <tr><td colspan="6" class="py-8 text-center type-caption text-deep/50">No orders match.</td></tr>
      {/each}
    </tbody>
  </table>
</div>

{#if data.pageCount > 1}
  <div class="mt-6 flex items-center gap-3 type-caption">
    {#if data.page > 1}<a href={pageLink(data.page - 1)} class="font-semibold text-green">Previous</a>{/if}
    <span class="text-deep/50">Page {data.page} of {data.pageCount}</span>
    {#if data.page < data.pageCount}<a href={pageLink(data.page + 1)} class="font-semibold text-green">Next</a>{/if}
  </div>
{/if}

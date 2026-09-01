<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import OrderStatusTracker from '$lib/components/ui/OrderStatusTracker.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { formatCents } from '$lib/utils';
  import { formatPickupDateLabel } from '$lib/pickup';
  import { SITE_NAME } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  // Cancelled orders sit outside the linear rail; everything else maps onto it.
  const STAGES = ['Placed', 'Confirmed', 'Ready for pickup', 'Collected'];
  const STAGE_BY_STATUS: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    ready: 2,
    collected: 3
  };

  const current = $derived(STAGE_BY_STATUS[data.order?.status ?? 'pending'] ?? 0);
  const cancelled = $derived(data.order?.status === 'cancelled');
</script>

<Seo noindex title="Track order {data.ref} | {SITE_NAME}" canonical="/track/{data.ref}" />

<Section tone="cream" innerClass="max-w-2xl">
  {#if !data.order}
    <h1 class="text-3xl font-semibold text-green">Order not found</h1>
    <p class="type-body mt-3 text-deep/70">
      We couldn't find an order with reference <strong>{data.ref}</strong>. Check the reference in
      your confirmation email.
    </p>
    <Button href="/shop" class="mt-6">Back to shop</Button>
  {:else}
    <p class="type-overline text-green">Order {data.order.orderRef}</p>
    <h1 class="mt-2 text-3xl font-semibold text-green sm:text-4xl">Order status</h1>

    {#if cancelled}
      <div class="mt-6">
        <Badge tone="error">Cancelled</Badge>
        <p class="type-body mt-3 text-deep/70">
          This order has been cancelled. Contact the store if that's unexpected.
        </p>
      </div>
    {:else}
      <div class="mt-8">
        <OrderStatusTracker
          stages={STAGES.map((label) => ({ label }))}
          {current}
          orientation="vertical"
        />
      </div>
    {/if}

    <div class="mt-8 rounded-2xl border-2 border-deep/10 bg-white/50 p-6">
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 type-caption">
        <dt class="text-deep/50">Pickup date</dt>
        <dd class="font-semibold text-deep">{formatPickupDateLabel(data.order.pickupDate)}</dd>
        {#if data.order.pickupNotes}
          <dt class="text-deep/50">Your note</dt>
          <dd class="text-deep">{data.order.pickupNotes}</dd>
        {/if}
      </dl>
      <ul class="m-0 mt-4 flex list-none flex-col gap-1 border-t border-deep/10 p-0 pt-4">
        {#each data.order.items as item (item.name)}
          <li class="flex justify-between gap-3 type-caption text-deep/70">
            <span class="min-w-0 truncate">{item.quantity} × {item.name}</span>
            <span class="shrink-0">{formatCents(item.lineTotalCents)}</span>
          </li>
        {/each}
      </ul>
      <div class="mt-3 flex items-center justify-between border-t border-deep/10 pt-3">
        <span class="font-semibold text-deep">Total (cash on pickup)</span>
        <span class="font-semibold text-deep">{formatCents(data.order.totalCents)}</span>
      </div>
    </div>
  {/if}
</Section>

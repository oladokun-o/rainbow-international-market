<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { formatCents } from '$lib/utils';
  import { formatPickupDateLabel } from '$lib/pickup';
  import { SITE_NAME } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
</script>

<Seo noindex title="Order confirmed | {SITE_NAME}" canonical="/confirmation" />

<Section tone="cream" innerClass="max-w-2xl">
  {#if !data.order}
    <h1 class="text-3xl font-semibold text-green">We couldn't find that order</h1>
    <p class="type-body mt-3 text-deep/70">
      Check the reference in your confirmation email, or contact the store for help.
    </p>
    <Button href="/shop" class="mt-6">Back to shop</Button>
  {:else}
    <p class="type-overline text-green">Order placed</p>
    <h1 class="mt-2 text-3xl font-semibold text-green sm:text-4xl">Thank you{data.order.customerName ? `, ${data.order.customerName}` : ''}</h1>
    <p class="type-body mt-3 text-deep/70">
      We've received your order. You'll get an email confirmation shortly. Pay cash when you
      collect.
    </p>

    <div class="mt-8 rounded-surface border-2 border-deep/10 bg-white/50 p-6">
      <div class="flex items-center justify-between">
        <span class="type-caption font-semibold uppercase tracking-wide text-deep/60">
          Order reference
        </span>
        <span class="font-display text-xl font-bold tracking-wide text-green">{data.order.orderRef}</span>
      </div>

      <dl class="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 type-caption">
        <dt class="text-deep/50">Pickup date</dt>
        <dd class="font-semibold text-deep">{formatPickupDateLabel(data.order.pickupDate)}</dd>
        {#if data.order.pickupNotes}
          <dt class="text-deep/50">Your note</dt>
          <dd class="text-deep">{data.order.pickupNotes}</dd>
        {/if}
        <dt class="text-deep/50">Status</dt>
        <dd class="text-deep capitalize">{data.order.status}</dd>
      </dl>

      <ul class="m-0 mt-5 flex list-none flex-col gap-1 border-t border-deep/10 p-0 pt-4">
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

    <div class="mt-6 flex flex-wrap gap-3">
      <Button href="/track/{data.order.orderRef}" variant="secondary">Track this order</Button>
      <Button href="/shop">Continue shopping</Button>
    </div>
  {/if}
</Section>

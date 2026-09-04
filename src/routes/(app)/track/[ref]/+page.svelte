<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import OrderStatusTracker from '$lib/components/ui/OrderStatusTracker.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { formatCents } from '$lib/utils';
  import { formatPickupDateLabel } from '$lib/pickup';
  import { SITE_NAME, PRIMARY_LOCATION, CONTACT_EMAIL } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  // Cancelled orders sit outside the linear rail; everything else maps onto it.
  const STAGES = [
    { label: 'Placed', detail: 'Order received' },
    { label: 'Confirmed', detail: "We're preparing it" },
    { label: 'Ready for pickup', detail: 'Collect in San Angelo' },
    { label: 'Collected', detail: 'Picked up — thank you!' }
  ];
  const STAGE_BY_STATUS: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    ready: 2,
    collected: 3
  };

  const STATUS_COPY: Record<string, { headline: string; detail: string }> = {
    pending: {
      headline: "We've got your order",
      detail: "We're reviewing it now — you'll hear from us soon."
    },
    confirmed: {
      headline: 'Your order is confirmed',
      detail: "We're getting it ready for pickup."
    },
    ready: {
      headline: 'Your order is ready',
      detail: 'Collect it in San Angelo — pay cash on pickup.'
    },
    collected: {
      headline: 'Order collected',
      detail: 'Thanks for shopping with us!'
    }
  };

  const current = $derived(STAGE_BY_STATUS[data.order?.status ?? 'pending'] ?? 0);
  const cancelled = $derived(data.order?.status === 'cancelled');
  const statusCopy = $derived(STATUS_COPY[data.order?.status ?? 'pending']);
  const firstName = $derived(data.order?.customerName?.trim().split(/\s+/)[0] ?? null);

  const phone = $derived(data.siteSettings?.phone || PRIMARY_LOCATION.phone);
  const email = $derived(data.siteSettings?.email || CONTACT_EMAIL);

  function formatOrderDate(iso: string | undefined): string {
    if (!iso) return '';
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function telHref(value: string): string {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
  }
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
    <p class="type-overline text-green">Order</p>
    <h1 class="mt-1 text-3xl font-semibold text-green sm:text-4xl">#{data.order.orderRef}</h1>
    {#if firstName || data.order.createdAt}
      <p class="type-caption mt-2 text-deep/60">
        {[firstName, formatOrderDate(data.order.createdAt)].filter(Boolean).join(' · ')}
      </p>
    {/if}

    {#if cancelled}
      <div class="mt-6 rounded-surface border-2 border-deep/10 bg-white/50 p-5">
        <Badge tone="error">Cancelled</Badge>
        <p class="type-body mt-3 text-deep/70">
          This order has been cancelled. Contact the store if that's unexpected.
        </p>
      </div>
    {:else}
      <!-- Status callout -->
      <div class="mt-6 rounded-surface border-2 border-deep/10 bg-white/50 p-5">
        <p class="text-[17px] font-semibold text-deep">{statusCopy.headline}</p>
        <p class="type-caption mt-1 text-deep/60">{statusCopy.detail}</p>
      </div>

      <!-- Progress -->
      <div class="mt-6 rounded-surface border-2 border-deep/10 bg-white/50 p-6">
        <OrderStatusTracker stages={STAGES} {current} orientation="vertical" />
      </div>
    {/if}

    <!-- Your order -->
    <div class="mt-6 rounded-surface border-2 border-deep/10 bg-white/50 p-6">
      <h2 class="text-[15px] font-semibold text-deep">Your order</h2>
      <dl class="type-caption mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt class="text-deep/50">Pickup date</dt>
        <dd class="font-semibold text-deep">{formatPickupDateLabel(data.order.pickupDate)}</dd>
        {#if data.order.pickupNotes}
          <dt class="text-deep/50">Your note</dt>
          <dd class="text-deep">{data.order.pickupNotes}</dd>
        {/if}
      </dl>
      <ul class="m-0 mt-4 flex list-none flex-col gap-1 border-t border-deep/10 p-0 pt-4">
        {#each data.order.items as item (item.name)}
          <li class="type-caption flex justify-between gap-3 text-deep/70">
            <span class="min-w-0 truncate">{item.quantity} × {item.name}</span>
            <span class="shrink-0">{formatCents(item.lineTotalCents)}</span>
          </li>
        {/each}
      </ul>
      <div class="mt-3 flex items-center justify-between border-t border-deep/10 pt-3">
        <span class="font-semibold text-deep">Total (pay in cash)</span>
        <span class="font-semibold text-deep">{formatCents(data.order.totalCents)}</span>
      </div>
    </div>

    <!-- Need help? -->
    {#if phone || email}
      <div class="mt-6 rounded-surface border-2 border-deep/10 bg-white/50 p-6">
        <h2 class="text-[15px] font-semibold text-deep">Need help?</h2>
        <div class="type-caption mt-3 flex flex-col gap-1.5 text-deep/70">
          {#if phone}
            <a href={telHref(phone)} class="hover:text-green">{phone}</a>
          {/if}
          {#if email}
            <a href="mailto:{email}" class="hover:text-green">{email}</a>
          {/if}
        </div>
      </div>
    {/if}

    <a href="/shop" class="type-caption mt-8 inline-block font-semibold text-orange hover:underline">
      ← Back to shop
    </a>
  {/if}
</Section>

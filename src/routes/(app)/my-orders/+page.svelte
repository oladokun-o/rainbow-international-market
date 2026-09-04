<script lang="ts">
  import { onMount } from 'svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { formatCents } from '$lib/utils';
  import { formatPickupDateLabel } from '$lib/pickup';
  import { SITE_NAME } from '$lib/constants/site';
  import {
    getSession,
    setSession,
    clearSession,
    replaceSavedOrders,
    type SavedOrder
  } from '$lib/stores/savedOrders';

  const STAGES = ['pending', 'confirmed', 'ready', 'collected'];
  const STATUS_LABEL: Record<string, string> = {
    pending: 'Order received',
    confirmed: 'Confirmed',
    ready: 'Ready for pickup',
    collected: 'Collected',
    cancelled: 'Cancelled'
  };
  const STATUS_DOT: Record<string, string> = {
    pending: 'bg-deep/40',
    confirmed: 'bg-green',
    ready: 'bg-orange',
    collected: 'bg-deep/40',
    cancelled: 'bg-deep/40'
  };
  const isActive = (status: string) => status !== 'collected' && status !== 'cancelled';
  const progressPct = (status: string) => {
    const idx = STAGES.indexOf(status);
    if (idx < 0) return 0;
    return Math.round(((idx + 1) / STAGES.length) * 100);
  };

  let mounted = $state(false);
  let sessionEmail = $state('');
  let email = $state('');
  let phoneLast4 = $state('');
  let orders = $state<SavedOrder[]>([]);
  let loading = $state(false);
  let err = $state('');

  onMount(async () => {
    const session = getSession();
    if (session) {
      email = session.email;
      phoneLast4 = session.phoneLast4;
      await lookup(session.email, session.phoneLast4, false);
    }
    mounted = true;
  });

  async function lookup(em: string, ph: string, saveSession: boolean) {
    loading = true;
    err = '';
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: em, phoneLast4: ph })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        err = data.message ?? "We couldn't find an order with that reference and email.";
        orders = [];
        return;
      }
      const data = await res.json();
      orders = data.orders ?? [];
      replaceSavedOrders(orders);
      if (saveSession) setSession(em, ph);
      sessionEmail = em;
    } catch {
      err = 'Something went wrong. Please try again.';
    } finally {
      loading = false;
    }
  }

  async function submit() {
    const em = email.trim().toLowerCase();
    const ph = phoneLast4.replace(/\D/g, '').slice(-4);
    if (!em || ph.length !== 4) {
      err = 'Enter your email and the last 4 digits of your phone number.';
      return;
    }
    await lookup(em, ph, true);
  }

  function signOut() {
    clearSession();
    sessionEmail = '';
    email = '';
    phoneLast4 = '';
    orders = [];
    err = '';
  }
</script>

<Seo
  noindex
  title="My orders | {SITE_NAME}"
  canonical="/my-orders"
  description="Find your Rainbow International Market pickup orders."
/>

<Section tone="cream" innerClass="max-w-md">
  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-3xl font-semibold text-green sm:text-4xl">My orders</h1>
      <p class="type-body mt-3 text-deep/70">
        Find every order placed with this email — no account needed.
      </p>
    </div>
    {#if sessionEmail}
      <button
        type="button"
        onclick={signOut}
        class="type-caption shrink-0 font-semibold text-deep/50 hover:text-deep"
      >
        Sign out
      </button>
    {/if}
  </div>

  {#if !mounted}
    <div class="mt-8 flex justify-center">
      <span
        class="size-5 animate-spin rounded-full border-2 border-deep/15 border-t-green"
        aria-hidden="true"
      ></span>
    </div>
  {:else if !sessionEmail}
    <form
      class="mt-6 flex flex-col gap-4"
      onsubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <Input label="Email address" name="email" type="email" autocomplete="email" bind:value={email} required />
      <div>
        <Input
          label="Last 4 digits of your phone"
          name="phoneLast4"
          type="tel"
          autocomplete="off"
          placeholder="e.g. 1902"
          bind:value={phoneLast4}
          required
        />
        <p class="type-caption mt-2 text-deep/50">
          Used to verify your identity. We never show your full phone number here.
        </p>
      </div>
      {#if err}
        <StatusMessage tone="error">{err}</StatusMessage>
      {/if}
      <Button type="submit" loading={loading}>Find my orders</Button>
    </form>
    <p class="type-caption mt-6 text-center text-deep/40">
      We verify with email + phone digits. Your info is never shared. This stays signed in on
      this device for 30 days.
    </p>
  {:else if loading}
    <div class="mt-8 flex items-center justify-center gap-3 text-deep/60">
      <span class="size-5 animate-spin rounded-full border-2 border-deep/15 border-t-green" aria-hidden="true"
      ></span>
      Loading orders…
    </div>
  {:else if err}
    <div class="mt-8">
      <StatusMessage tone="error">{err}</StatusMessage>
      <Button variant="secondary" size="sm" class="mt-4" onclick={signOut}>Try a different email</Button>
    </div>
  {:else if orders.length === 0}
    <div class="mt-8">
      <EmptyState message="No orders found" hint={`No orders found for ${sessionEmail}.`}>
        <Button href="/shop" size="sm">Browse the catalogue</Button>
      </EmptyState>
    </div>
  {:else}
    <p class="type-caption mt-8 font-semibold text-deep/50">
      {orders.length} order{orders.length !== 1 ? 's' : ''} for {sessionEmail}
    </p>
    <div class="mt-4 flex flex-col gap-4">
      {#each orders as order (order.orderRef)}
        <div class="overflow-hidden rounded-surface border-2 border-deep/10 bg-white/60">
          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[15px] font-semibold text-deep">Order #{order.orderRef}</p>
                <p class="type-caption mt-0.5 text-deep/50">
                  {formatPickupDateLabel(order.pickupDate)} · {order.itemCount} item{order.itemCount !== 1
                    ? 's'
                    : ''}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <span class="size-2 shrink-0 rounded-full {STATUS_DOT[order.status] ?? 'bg-deep/40'}"
                ></span>
                <span class="type-caption font-semibold text-deep">
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <span class="font-display text-[16px] text-green">{formatCents(order.totalCents)}</span>
              <Button href="/track/{order.orderRef}" size="sm" variant="secondary">Track</Button>
            </div>
          </div>
          {#if isActive(order.status)}
            <div class="h-1 bg-deep/10">
              <div
                class="h-full bg-orange transition-[width] duration-slow"
                style="width: {progressPct(order.status)}%"
              ></div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
    <div class="mt-6 flex justify-center">
      <Button href="/shop">Place another order</Button>
    </div>
  {/if}
</Section>

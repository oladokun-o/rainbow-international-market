<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import StepIndicator from '$lib/components/ui/StepIndicator.svelte';
  import CartLine from '$lib/components/ui/CartLine.svelte';
  import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { formatCents, isValidEmail } from '$lib/utils';
  import { formatPickupDateLabel } from '$lib/pickup';
  import { cart } from '$lib/stores/cart.svelte';
  import { SITE_NAME } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const STEPS = ['Review', 'Details', 'Pickup'];
  const SESSION_KEY = 'rim-checkout';

  let step = $state(0);
  let name = $state('');
  let email = $state('');
  let phone = $state('');
  let pickupDate = $state('');
  let pickupNotes = $state('');
  let submitting = $state(false);
  let errorMessage = $state('');
  let hydrated = $state(false);

  const phoneRe = /^\+?[\d\s\-().]{7,20}$/;

  const detailsValid = $derived(
    name.trim().length > 0 && isValidEmail(email) && phoneRe.test(phone.trim())
  );
  const pickupValid = $derived(data.pickupDateOptions.includes(pickupDate));
  const canPlace = $derived(
    data.orderingEnabled && cart.lines.length > 0 && detailsValid && pickupValid && !submitting
  );

  onMount(() => {
    if (cart.lines.length === 0) {
      goto('/cart');
      return;
    }
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        step = Number(s.step) || 0;
        name = s.name ?? '';
        email = s.email ?? '';
        phone = s.phone ?? '';
        pickupDate = s.pickupDate ?? '';
        pickupNotes = s.pickupNotes ?? '';
      }
    } catch {
      /* ignore a corrupt draft */
    }
    hydrated = true;
  });

  $effect(() => {
    if (!hydrated) return;
    const draft = JSON.stringify({ step, name, email, phone, pickupDate, pickupNotes });
    try {
      sessionStorage.setItem(SESSION_KEY, draft);
    } catch {
      /* storage disabled — the draft just won't survive a reload */
    }
  });

  function next() {
    if (step < STEPS.length - 1) step += 1;
  }
  function back() {
    if (step > 0) step -= 1;
  }

  async function placeOrder() {
    if (!canPlace) return;
    submitting = true;
    errorMessage = '';
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          items: cart.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          pickupDate,
          pickupNotes: pickupNotes.trim()
        })
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        errorMessage = payload?.message ?? 'Something went wrong. Please try again.';
        submitting = false;
        return;
      }
      cart.clear();
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
      await goto(`/confirmation?ref=${payload.orderRef}`);
    } catch {
      errorMessage = 'Network error. Please check your connection and try again.';
      submitting = false;
    }
  }
</script>

<Seo noindex title="Checkout | {SITE_NAME}" canonical="/checkout" />

<Section tone="cream">
  <h1 class="text-3xl font-semibold text-green sm:text-4xl">Checkout</h1>

  <div class="mt-6 max-w-md">
    <StepIndicator steps={STEPS} current={step} />
  </div>

  {#if !data.orderingEnabled}
    <div class="mt-6">
      <StatusMessage tone="error">
        Online ordering is paused right now. Please try again later or call the store.
      </StatusMessage>
    </div>
  {/if}

  <div class="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
    <div class="min-w-0">
      {#if step === 0}
        <h2 class="font-semibold text-deep">Review your order</h2>
        <div class="mt-3 divide-y divide-deep/10">
          {#each cart.lines as line (line.id)}
            <CartLine
              name={line.name}
              quantity={line.quantity}
              price={formatCents(line.priceCents * line.quantity)}
            />
          {/each}
        </div>
        <div class="mt-6">
          <Button onclick={next}>Continue to details</Button>
        </div>
      {:else if step === 1}
        <h2 class="font-semibold text-deep">Your details</h2>
        <div class="mt-4 flex flex-col gap-4">
          <Input
            label="Full name"
            autocomplete="name"
            bind:value={name}
            required
            requiredMessage="Please enter your name"
          />
          <Input
            label="Email"
            type="email"
            autocomplete="email"
            bind:value={email}
            validate={(v) => (isValidEmail(v) ? null : 'Please enter a valid email address')}
          />
          <Input
            label="Phone"
            type="tel"
            autocomplete="tel"
            bind:value={phone}
            validate={(v) => (phoneRe.test(v.trim()) ? null : 'Please enter a valid phone number')}
          />
        </div>
        <div class="mt-6 flex gap-3">
          <Button variant="secondary" onclick={back}>Back</Button>
          <Button onclick={next} disabled={!detailsValid}>Continue to pickup</Button>
        </div>
      {:else}
        <h2 class="font-semibold text-deep">Pickup</h2>
        {#if data.pickupAddress}
          <p class="type-caption mt-1 text-deep/60">{data.pickupAddress}</p>
        {/if}
        {#if data.pickupDateOptions.length === 0}
          <p class="type-body mt-4 text-deep/70">
            No pickup dates are available right now. Please contact the store to arrange collection.
          </p>
        {:else}
          <fieldset class="mt-4 flex flex-col gap-2">
            <legend class="type-caption font-semibold text-deep">Choose a pickup date</legend>
            {#each data.pickupDateOptions as date (date)}
              <label
                class="flex cursor-pointer items-center gap-3 rounded-surface border-2 border-deep/15 bg-white/50 px-4 py-3"
              >
                <input type="radio" name="pickupDate" value={date} bind:group={pickupDate} />
                <span class="text-deep">{formatPickupDateLabel(date)}</span>
              </label>
            {/each}
          </fieldset>
        {/if}
        {#if data.pickupWindow}
          <p class="type-caption mt-3 text-deep/60">Pickup window: {data.pickupWindow}</p>
        {/if}
        {#if data.pickupInstructions}
          <p class="type-caption mt-1 text-deep/60">{data.pickupInstructions}</p>
        {/if}

        <div class="mt-4">
          <Textarea label="Notes for the store (optional)" bind:value={pickupNotes} rows={3} />
        </div>

        {#if errorMessage}
          <div class="mt-4">
            <StatusMessage tone="error">{errorMessage}</StatusMessage>
          </div>
        {/if}

        <div class="mt-6 flex gap-3">
          <Button variant="secondary" onclick={back}>Back</Button>
          <Button onclick={placeOrder} loading={submitting} disabled={!canPlace}>
            Place order
          </Button>
        </div>
      {/if}
    </div>

    <aside class="rounded-surface border-2 border-deep/10 bg-white/50 p-6">
      <h2 class="font-semibold text-deep">Order summary</h2>
      <ul class="m-0 mt-3 flex list-none flex-col gap-1 p-0">
        {#each cart.lines as line (line.id)}
          <li class="flex justify-between gap-3 type-caption text-deep/70">
            <span class="min-w-0 truncate">{line.quantity} × {line.name}</span>
            <span class="shrink-0">{formatCents(line.priceCents * line.quantity)}</span>
          </li>
        {/each}
      </ul>
      <div class="mt-4 flex items-center justify-between border-t border-deep/10 pt-4">
        <span class="font-semibold text-deep">Subtotal</span>
        <span class="font-semibold text-deep">{formatCents(cart.subtotalCents)}</span>
      </div>
      <p class="type-caption mt-2 text-deep/60">Pay cash when you collect.</p>
    </aside>
  </div>
</Section>

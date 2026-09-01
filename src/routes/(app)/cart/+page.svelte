<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import QuantityStepper from '$lib/components/ui/QuantityStepper.svelte';
  import EmptyState from '$lib/components/ui/EmptyState.svelte';
  import PhotoPlaceholder from '$lib/components/ui/PhotoPlaceholder.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { formatCents } from '$lib/utils';
  import { cart } from '$lib/stores/cart.svelte';
  import { SITE_NAME } from '$lib/constants/site';
</script>

<Seo noindex title="Your cart | {SITE_NAME}" canonical="/cart" />

<Section tone="cream">
  <h1 class="text-3xl font-semibold text-green sm:text-4xl">Your cart</h1>

  {#if cart.lines.length === 0}
    <div class="mt-8">
      <EmptyState message="Your cart is empty" hint="Browse the catalogue to get started.">
        <Button href="/shop" variant="secondary" size="sm">Go to shop</Button>
      </EmptyState>
    </div>
  {:else}
    <div class="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
      <ul class="m-0 flex list-none flex-col gap-4 p-0">
        {#each cart.lines as line (line.id)}
          <li class="flex gap-4 border-b border-deep/10 pb-4">
            <div class="size-20 shrink-0 overflow-hidden rounded-xl">
              {#if line.image}
                <img src={line.image} alt={line.name} class="size-full object-cover" />
              {:else}
                <PhotoPlaceholder label="Photo" class="size-full" />
              {/if}
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <div class="flex items-start justify-between gap-3">
                <p class="min-w-0 font-semibold text-deep">{line.name}</p>
                <span class="shrink-0 font-semibold text-deep">
                  {formatCents(line.priceCents * line.quantity)}
                </span>
              </div>
              {#if line.unit}
                <p class="type-caption text-deep/50">{line.unit}</p>
              {/if}
              <div class="mt-1 flex items-center gap-4">
                <QuantityStepper
                  size="sm"
                  min={1}
                  value={line.quantity}
                  onChange={(n) => cart.updateQuantity(line.id, n)}
                />
                <button
                  type="button"
                  class="type-caption font-semibold text-green hover:text-deep"
                  onclick={() => cart.remove(line.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>

      <aside class="rounded-2xl border-2 border-deep/10 bg-white/50 p-6">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-deep">Subtotal</span>
          <span class="font-semibold text-deep">{formatCents(cart.subtotalCents)}</span>
        </div>
        <p class="type-caption mt-2 text-deep/60">
          Pay cash when you collect. Final total is confirmed at checkout.
        </p>
        <Button href="/checkout" class="mt-5 w-full">Proceed to checkout</Button>
        <a
          href="/shop"
          class="type-caption mt-3 block text-center font-semibold text-green hover:text-deep"
        >
          Continue shopping
        </a>
      </aside>
    </div>
  {/if}
</Section>

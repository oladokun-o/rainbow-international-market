<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Logo from '$lib/components/brand/Logo.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { SITE_NAME, PRIMARY_LOCATION, formatHoursSummary } from '$lib/constants/site';
</script>

<Seo
  title="About | {SITE_NAME}"
  canonical="/about"
  description="Rainbow International Market brings African, Caribbean, Asian and international groceries to San Angelo, TX — plus made-to-order prepared dishes."
/>

<Section tone="cream" innerClass="max-w-3xl">
  <p class="type-overline text-orange">Our story</p>
  <h1 class="mt-2 text-3xl font-semibold text-green sm:text-4xl">
    A world of flavour, close to home
  </h1>
  <span class="mt-4 block h-1 w-16 rounded-full bg-yellow"></span>

  <div class="mt-6 space-y-4 type-body text-deep/80">
    <p>
      Rainbow International Market was built for the cooks who miss the ingredients of home — and
      for the neighbours curious enough to try something new. We stock the pantry staples,
      spices, produce, frozen goods and household basics of African, Caribbean and Asian kitchens,
      all under one roof in San Angelo.
    </p>
    <p>
      When there isn't time to cook, our kitchen prepares a rotating selection of dishes to order.
      Reserve online, pay cash when you collect, and skip the queue.
    </p>
    <p>
      New products arrive often. If there's something you can't find, tell us — a big part of the
      shelf is shaped by what regulars ask for.
    </p>
  </div>

  <div class="mt-8">
    <Button href="/shop">Browse the catalogue</Button>
  </div>
</Section>

<Section tone="white" innerClass="max-w-3xl">
  <div class="grid gap-8 sm:grid-cols-2 sm:items-center">
    <div>
      <h2 class="text-2xl font-semibold text-deep">Visit us</h2>
      <p class="type-body mt-3 text-deep/70">{PRIMARY_LOCATION.address}</p>
      <p class="type-caption mt-2 text-deep/60">{formatHoursSummary(PRIMARY_LOCATION)}</p>
      {#if PRIMARY_LOCATION.phone}
        <p class="type-caption mt-1 text-deep/60">
          <a href={PRIMARY_LOCATION.phoneHref} class="font-semibold text-green">
            {PRIMARY_LOCATION.phone}
          </a>
        </p>
      {/if}
      <div class="mt-5">
        <Button href="/contact" variant="secondary" size="sm">Contact & directions</Button>
      </div>
    </div>
    <div class="grid place-items-center rounded-surface border-2 border-deep/10 bg-cream p-10">
      <Logo variant="mark" height={140} imgClass="h-auto w-full max-w-[9rem]" />
    </div>
  </div>
</Section>

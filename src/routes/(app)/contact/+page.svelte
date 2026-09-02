<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import ContactForm from '$lib/components/marketing/ContactForm.svelte';
  import {
    SITE_NAME,
    SOCIAL_LINKS,
    PRIMARY_LOCATION,
    formatHoursSummary
  } from '$lib/constants/site';
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
  const s = $derived(data.siteSettings);

  const address = $derived(s?.pickupAddress || PRIMARY_LOCATION.address);
  const phone = $derived(s?.phone || PRIMARY_LOCATION.phone);
  const email = $derived(s?.email || '');
  const hours = $derived(s?.hoursNote || formatHoursSummary(PRIMARY_LOCATION));
  const mapsUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
</script>

<Seo
  title="Contact | {SITE_NAME}"
  canonical="/contact"
  description="Get in touch with Rainbow International Market in San Angelo, TX — address, hours, phone, and a message form."
/>

<Section tone="cream" innerClass="max-w-4xl">
  <p class="type-overline text-orange">Contact</p>
  <h1 class="mt-2 text-3xl font-semibold text-green sm:text-4xl">Get in touch</h1>
  <span class="mt-4 block h-1 w-16 rounded-full bg-yellow"></span>

  <div class="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
    <div class="space-y-5">
      <div>
        <p class="type-caption font-semibold uppercase tracking-wide text-deep/50">Store</p>
        <p class="type-body mt-1 text-deep/80">{address}</p>
        <a href={mapsUrl} target="_blank" rel="noopener" class="type-caption font-semibold text-green hover:text-orange">
          Open in Maps
        </a>
      </div>
      <div>
        <p class="type-caption font-semibold uppercase tracking-wide text-deep/50">Hours</p>
        <p class="type-body mt-1 text-deep/80">{hours}</p>
        {#if s?.pickupWindow}
          <p class="type-caption mt-1 text-deep/60">Pickup window: {s.pickupWindow}</p>
        {/if}
      </div>
      {#if phone}
        <div>
          <p class="type-caption font-semibold uppercase tracking-wide text-deep/50">Phone</p>
          <a href="tel:{phone.replace(/[^\d+]/g, '')}" class="type-body mt-1 block font-semibold text-green">
            {phone}
          </a>
        </div>
      {/if}
      {#if email}
        <div>
          <p class="type-caption font-semibold uppercase tracking-wide text-deep/50">Email</p>
          <a href="mailto:{email}" class="type-body mt-1 block font-semibold text-green">{email}</a>
        </div>
      {/if}
      {#if SOCIAL_LINKS.instagram}
        <div>
          <p class="type-caption font-semibold uppercase tracking-wide text-deep/50">Social</p>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener"
            class="type-body mt-1 block font-semibold text-green hover:text-orange"
          >
            @myrainbowmarket on Instagram
          </a>
        </div>
      {/if}
    </div>

    <div class="rounded-surface border-2 border-deep/10 bg-white/50 p-6 sm:p-8">
      <h2 class="text-lg font-semibold text-deep">Send us a message</h2>
      <p class="type-caption mt-1 text-deep/60">We usually reply within a day.</p>
      <div class="mt-5">
        <ContactForm />
      </div>
    </div>
  </div>
</Section>

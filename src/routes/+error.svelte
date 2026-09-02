<script lang="ts">
  import { page } from '$app/state';
  import Logo from '$lib/components/brand/Logo.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  const status = $derived(page.status);
  const isNotFound = $derived(status === 404);

  const heading = $derived(
    isNotFound ? 'Page not found' : status >= 500 ? 'Something went wrong' : 'That didn’t work'
  );
  const body = $derived(
    isNotFound
      ? 'The page you’re after has moved or never existed.'
      : status >= 500
        ? 'A hiccup on our end — please try again in a moment.'
        : (page.error?.message ?? 'Please try again.')
  );
</script>

<svelte:head>
  <title>{status} — Rainbow International Market</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-dvh place-items-center bg-cream px-6 py-16 text-center text-deep">
  <div class="max-w-md">
    <Logo variant="wordmark" href="/" height={32} class="mx-auto inline-block" imgClass="h-7 w-auto" />
    <p class="mt-10 font-display text-6xl font-bold text-orange sm:text-7xl">{status}</p>
    <span class="mx-auto mt-4 block h-1 w-16 rounded-full bg-yellow"></span>
    <h1 class="mt-6 text-2xl font-semibold text-green">{heading}</h1>
    <p class="type-body mt-3 text-deep/70">{body}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <Button href="/">Back home</Button>
      <Button href="/shop" variant="secondary">Browse the catalogue</Button>
    </div>
  </div>
</main>

<script lang="ts">
  import { page } from '$app/state';

  const status = $derived(page.status);
  const message = $derived(
    status === 404
      ? 'That admin page does not exist.'
      : status === 403
        ? 'Your role does not have access to that.'
        : (page.error?.message ?? 'Something went wrong.')
  );
</script>

<svelte:head><title>{status} — Rainbow Admin</title></svelte:head>

<div class="max-w-md">
  <p class="font-display text-4xl font-bold text-orange">{status}</p>
  <p class="type-body mt-2 text-deep/70">{message}</p>
  <a href="/admin" class="mt-4 inline-block type-caption font-semibold text-green hover:text-orange">
    Back to the dashboard
  </a>
</div>

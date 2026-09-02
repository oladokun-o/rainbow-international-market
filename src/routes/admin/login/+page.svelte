<script lang="ts">
  import { enhance } from '$app/forms';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
  import type { ActionData } from './$types';

  const { form }: { form: ActionData } = $props();
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Admin sign in — Rainbow International Market</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="grid min-h-dvh place-items-center bg-cream p-6 text-deep">
  <div class="w-full max-w-sm">
    <p class="font-display text-xl font-bold tracking-wide text-green">RAINBOW</p>
    <h1 class="mt-1 text-2xl font-semibold text-deep">Admin sign in</h1>

    <form
      method="POST"
      class="mt-6 flex flex-col gap-4"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
        };
      }}
    >
      <Input
        label="Email"
        name="email"
        type="email"
        autocomplete="username"
        value={form?.email ?? ''}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
      />
      {#if form?.error}
        <StatusMessage tone="error">{form.error}</StatusMessage>
      {/if}
      <Button type="submit" loading={submitting}>Sign in</Button>
    </form>
  </div>
</div>

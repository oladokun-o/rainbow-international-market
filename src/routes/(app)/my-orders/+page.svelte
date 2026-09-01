<script lang="ts">
  import { enhance } from '$app/forms';
  import Section from '$lib/components/ui/Section.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { SITE_NAME } from '$lib/constants/site';
  import type { ActionData } from './$types';

  const { form }: { form: ActionData } = $props();

  let submitting = $state(false);
</script>

<Seo
  title="Find your order | {SITE_NAME}"
  canonical="/my-orders"
  description="Look up a Rainbow International Market pickup order by reference and email."
/>

<Section tone="cream" innerClass="max-w-md">
  <h1 class="text-3xl font-semibold text-green sm:text-4xl">Find your order</h1>
  <p class="type-body mt-3 text-deep/70">
    Enter the reference from your confirmation email and the email address on the order.
  </p>

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
      label="Order reference"
      name="ref"
      placeholder="RIM-XXXXX"
      value={form?.ref ?? ''}
      required
    />
    <Input
      label="Email"
      name="email"
      type="email"
      autocomplete="email"
      value={form?.email ?? ''}
      required
    />
    {#if form?.error}
      <StatusMessage tone="error">{form.error}</StatusMessage>
    {/if}
    <Button type="submit" loading={submitting}>Find my order</Button>
  </form>
</Section>

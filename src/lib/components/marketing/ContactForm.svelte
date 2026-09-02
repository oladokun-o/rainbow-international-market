<script lang="ts">
  import Input from '$lib/components/ui/Input.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import StatusMessage from '$lib/components/ui/StatusMessage.svelte';
  import { isValidEmail } from '$lib/utils';

  let submitting = $state(false);
  let sent = $state(false);
  let error = $state('');

  let name = $state('');
  let email = $state('');
  let message = $state('');

  const valid = $derived(name.trim().length > 0 && isValidEmail(email) && message.trim().length > 0);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!valid || submitting) return;
    submitting = true;
    error = '';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      });
      if (res.ok) {
        sent = true;
      } else {
        const body = await res.json().catch(() => null);
        error = body?.message ?? 'Something went wrong. Please try again.';
      }
    } catch {
      error = 'Network error. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

{#if sent}
  <StatusMessage tone="success">
    Thanks — your message is on its way. We'll reply by email.
  </StatusMessage>
{:else}
  <form class="flex flex-col gap-4" onsubmit={submit}>
    <Input label="Name" name="name" autocomplete="name" bind:value={name} required />
    <Input
      label="Email"
      name="email"
      type="email"
      autocomplete="email"
      bind:value={email}
      validate={(v) => (isValidEmail(v) ? null : 'Please enter a valid email address')}
    />
    <Textarea label="Message" name="message" rows={5} bind:value={message} required />
    {#if error}
      <StatusMessage tone="error">{error}</StatusMessage>
    {/if}
    <div>
      <Button type="submit" loading={submitting} disabled={!valid}>Send message</Button>
    </div>
  </form>
{/if}

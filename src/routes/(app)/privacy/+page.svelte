<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { SITE_NAME, CONTACT_EMAIL } from '$lib/constants/site';

  const updated = 'September 2026';
</script>

<Seo title="Privacy Policy | {SITE_NAME}" canonical="/privacy" noindex />

<Section tone="cream" innerClass="max-w-2xl">
  <h1 class="text-3xl font-semibold text-green">Privacy Policy</h1>
  <p class="type-caption mt-2 text-deep/50">Last updated {updated}</p>

  <div class="mt-6 space-y-5 type-body text-deep/80">
    <p>
      This policy explains what {SITE_NAME} collects when you use this website and how we use it.
      We keep it deliberately short because we collect very little.
    </p>

    <h2 class="text-lg font-semibold text-deep">What we collect</h2>
    <ul class="list-disc space-y-1 pl-5">
      <li>
        <strong>Order details</strong> — when you place a pickup reservation we store your name,
        email address, phone number, the items reserved, and your chosen pickup date.
      </li>
      <li>
        <strong>Messages</strong> — anything you send through the contact form (your name, email,
        and message).
      </li>
      <li>
        <strong>Basic technical data</strong> — our host records standard server logs (IP address,
        browser type, pages requested) for security and troubleshooting.
      </li>
    </ul>
    <p>We do not use advertising trackers, and we do not sell or rent your information.</p>

    <h2 class="text-lg font-semibold text-deep">How we use it</h2>
    <ul class="list-disc space-y-1 pl-5">
      <li>To prepare and hand over your order, and to contact you about it.</li>
      <li>To reply to messages you send us.</li>
      <li>To keep the site running securely.</li>
    </ul>

    <h2 class="text-lg font-semibold text-deep">Who processes it</h2>
    <p>
      The site runs on Vercel (hosting), stores catalogue content in Sanity, stores orders in
      MongoDB Atlas, and sends transactional email through Resend. Each provider only receives the
      data needed to perform its function.
    </p>

    <h2 class="text-lg font-semibold text-deep">Retention</h2>
    <p>
      Order records are kept for our business and tax records. Contact-form messages are kept only
      as long as needed to resolve your enquiry.
    </p>

    <h2 class="text-lg font-semibold text-deep">Your choices</h2>
    <p>
      To ask what we hold about you, to correct it, or to have it deleted where we are not required
      to keep it, email
      <a href="mailto:{CONTACT_EMAIL}" class="font-semibold text-green">{CONTACT_EMAIL}</a>.
    </p>

    <h2 class="text-lg font-semibold text-deep">Changes</h2>
    <p>If this policy changes, the date above will be updated.</p>
  </div>
</Section>

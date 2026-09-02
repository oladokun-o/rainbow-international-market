<script lang="ts">
  import Section from '$lib/components/ui/Section.svelte';
  import Seo from '$lib/components/seo/Seo.svelte';
  import { SITE_NAME, CONTACT_EMAIL } from '$lib/constants/site';

  const updated = 'September 2026';
</script>

<Seo title="Terms of Service | {SITE_NAME}" canonical="/terms" noindex />

<Section tone="cream" innerClass="max-w-2xl">
  <h1 class="text-3xl font-semibold text-green">Terms of Service</h1>
  <p class="type-caption mt-2 text-deep/50">Last updated {updated}</p>

  <div class="mt-6 space-y-5 type-body text-deep/80">
    <p>
      These terms cover your use of the {SITE_NAME} website and the pickup-reservation service. By
      placing an order you agree to them.
    </p>

    <h2 class="text-lg font-semibold text-deep">Reservations, not sales</h2>
    <p>
      Placing an order on this site reserves items for in-store pickup. It is not a completed sale.
      Payment is made in cash at the counter when you collect. Prices, availability, and the
      prepared-food menu can change, and an item may sell out before your pickup — if that happens
      we'll let you know and adjust or cancel the affected line.
    </p>

    <h2 class="text-lg font-semibold text-deep">Pickup</h2>
    <p>
      Collect your order on the date you selected, during the store's pickup window, and bring your
      order reference. Prepared dishes require the lead time shown on the product. Orders not
      collected within a reasonable time of the chosen date may be cancelled.
    </p>

    <h2 class="text-lg font-semibold text-deep">Pricing and errors</h2>
    <p>
      We try to keep prices and descriptions accurate. If a clear pricing or description error
      affects your order, we may correct it or cancel the order before handover.
    </p>

    <h2 class="text-lg font-semibold text-deep">Acceptable use</h2>
    <p>
      Don't use the site to place fraudulent orders, to disrupt the service, or to infringe others'
      rights. We may refuse or cancel orders and restrict access where we reasonably suspect
      misuse.
    </p>

    <h2 class="text-lg font-semibold text-deep">Liability</h2>
    <p>
      The site is provided "as is". To the extent the law allows, {SITE_NAME} is not liable for
      indirect or incidental losses arising from use of the site. Nothing here limits liability
      that cannot be limited by law.
    </p>

    <h2 class="text-lg font-semibold text-deep">Contact</h2>
    <p>
      Questions about these terms:
      <a href="mailto:{CONTACT_EMAIL}" class="font-semibold text-green">{CONTACT_EMAIL}</a>.
    </p>
  </div>
</Section>

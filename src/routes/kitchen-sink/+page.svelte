<!-- scratch route — remove before launch -->
<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Section from "$lib/components/ui/Section.svelte";
  import SectionDivider from "$lib/components/ui/SectionDivider.svelte";
  import Icon from "$lib/components/ui/Icon.svelte";
  import IconButton from "$lib/components/ui/IconButton.svelte";
  import QuantityStepper from "$lib/components/ui/QuantityStepper.svelte";
  import StepIndicator from "$lib/components/ui/StepIndicator.svelte";
  import Accordion from "$lib/components/ui/Accordion.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import StatusMessage from "$lib/components/ui/StatusMessage.svelte";
  import PhotoPlaceholder from "$lib/components/ui/PhotoPlaceholder.svelte";
  import MenuItemCard from "$lib/components/ui/MenuItemCard.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import Drawer from "$lib/components/ui/Drawer.svelte";
  import Carousel from "$lib/components/ui/Carousel.svelte";
  import Breadcrumbs from "$lib/components/ui/Breadcrumbs.svelte";
  import CartLine from "$lib/components/ui/CartLine.svelte";
  import Checkbox from "$lib/components/ui/Checkbox.svelte";
  import RadioGroup from "$lib/components/ui/RadioGroup.svelte";
  import OrderStatusTracker from "$lib/components/ui/OrderStatusTracker.svelte";
  import Header from "$lib/components/ui/Header.svelte";
  import Footer from "$lib/components/ui/Footer.svelte";
  import MotifBand from "$lib/components/brand/MotifBand.svelte";
  import { toastStore } from "$lib/stores/toast.svelte";
  import { MARKETING_NAV } from "$lib/constants/site";

  const buttonVariants = ["primary", "secondary", "ghost", "inverse"] as const;
  const cardTones = ["default", "strong", "green", "deep", "outline"] as const;
  const badgeTones = [
    "green",
    "deep",
    "orange",
    "outline",
    "success",
    "error",
    "warning",
    "progress",
  ] as const;

  let selectValue = $state("");
  let qty = $state(2);
  let modalOpen = $state(false);
  let drawerOpen = $state(false);
  let checked = $state(true);
  let radio = $state("pickup");
  let accordionOpen = $state<string[]>(["a"]);
</script>

{#snippet navSnippet()}
  {#each MARKETING_NAV as link (link.href)}
    <a
      href={link.href}
      class="type-caption font-semibold text-deep hover:text-green"
      >{link.label}</a
    >
  {/each}
{/snippet}

<!-- This scratch route sits outside the (app) layout, so it needs its own
     page shell (background + text color) rather than inheriting one. -->
<div class="min-h-dvh bg-cream text-deep">
  <Header nav={navSnippet} location="San Angelo" />

  <Section>
    <h1 class="type-hero text-green">Kitchen sink</h1>
    <p class="type-body-lg text-deep/70">
      Every ported design-system primitive, for visual review.
    </p>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Buttons</h2>
    <div class="flex flex-col gap-4">
      {#each buttonVariants as v (v)}
        <div
          class="flex flex-wrap items-center gap-3"
          class:bg-green={v === "inverse"}
          style={v === "inverse" ? "padding:1rem;border-radius:1rem" : ""}
        >
          <Button variant={v} size="lg">{v} lg</Button>
          <Button variant={v} size="sm">{v} sm</Button>
          <Button variant={v} size="lg" loading>loading</Button>
          <Button variant={v} size="lg" disabled>disabled</Button>
        </div>
      {/each}
      <div>
        <Button onclick={() => toastStore.push("Toast fired", "success")}
          >Fire a toast</Button
        >
      </div>
    </div>
  </Section>

  <Section>
    <h2 class="type-script text-green mb-4">Cards</h2>
    <div class="grid gap-4 sm:grid-cols-3">
      {#each cardTones as t (t)}
        <Card tone={t}>
          <p class="font-semibold">Card / {t}</p>
          <p class="type-caption">Body copy inside the card surface.</p>
        </Card>
      {/each}
    </div>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Badges</h2>
    <div class="flex flex-wrap gap-2">
      {#each badgeTones as t (t)}
        <Badge tone={t}>{t}</Badge>
      {/each}
    </div>
  </Section>

  <Section>
    <h2 class="type-script text-green mb-4">Form controls</h2>
    <div class="grid gap-6 sm:max-w-md">
      <Input label="Name" name="name" placeholder="Jane Doe" required />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        validate={(v) => (v.includes("@") ? null : "Enter a valid email")}
        validateOn="input"
        hint="We only email order updates."
      />
      <Input label="With error" name="err" error="Something is wrong" />
      <Textarea
        label="Notes"
        name="notes"
        optionalNote="optional"
        placeholder="Anything else?"
      />
      <Select
        id="cat"
        ariaLabel="Category"
        bind:value={selectValue}
        options={[
          { value: "groceries", label: "Groceries" },
          { value: "produce", label: "Fresh Produce" },
          { value: "frozen", label: "Frozen Foods" },
        ]}
      />
      <Checkbox
        label="Add a gift note"
        description="Handwritten at pickup"
        bind:checked
        price="+$1.50"
      />
      <RadioGroup
        label="Fulfilment"
        name="fulfil"
        bind:value={radio}
        options={[
          {
            value: "pickup",
            label: "Store pickup",
            description: "Cash on collection",
          },
          { value: "hold", label: "Hold at counter", price: "Free" },
        ]}
      />
      <StatusMessage tone="success">Saved.</StatusMessage>
      <StatusMessage tone="error">Could not save.</StatusMessage>
    </div>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Icons &amp; icon buttons</h2>
    <div class="flex flex-wrap items-center gap-3">
      <Icon name="cart" size={24} />
      <Icon name="search" size={24} />
      <Icon name="map-pin" size={24} />
      <IconButton icon="plus" label="Add" variant="solid" />
      <IconButton icon="trash" label="Delete" variant="danger" />
      <IconButton icon="edit" label="Edit" variant="outline" />
      <QuantityStepper bind:value={qty} />
    </div>
  </Section>

  <Section>
    <h2 class="type-script text-green mb-4">Step indicator</h2>
    <StepIndicator steps={["Cart", "Details", "Pickup", "Done"]} current={2} />
    <div class="mt-8">
      <OrderStatusTracker
        stages={[
          { label: "Pending", detail: "10:02 AM" },
          { label: "Confirmed", detail: "10:15 AM" },
          { label: "Ready" },
          { label: "Collected" },
        ]}
        current={2}
      />
    </div>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Accordion</h2>
    <Accordion
      bind:open={accordionOpen}
      items={[
        { id: "a", label: "How does pickup work?" },
        { id: "b", label: "Do you deliver?" },
      ]}
    >
      {#snippet content(item)}
        <p class="type-caption text-deep/70">Answer for {item.label}</p>
      {/snippet}
    </Accordion>
  </Section>

  <Section>
    <h2 class="type-script text-green mb-4">Empty state</h2>
    <EmptyState
      message="Your cart is empty"
      hint="Add some groceries to get started."
    >
      <Button href="/shop">Browse the shop</Button>
    </EmptyState>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Photo placeholder</h2>
    <PhotoPlaceholder
      label="Hero photo"
      class="aspect-video w-full rounded-surface"
    />
  </Section>

  <Section>
    <h2 class="type-script text-green mb-4">Product cards</h2>
    <div class="grid gap-4 sm:grid-cols-3">
      <MenuItemCard
        name="Jollof rice mix"
        description="500g"
        price="$6.99"
        tags={["New"]}
        onAdd={() => {}}
      />
      <MenuItemCard name="Plantain chips" price="$2.49" onAdd={() => {}} />
      <MenuItemCard
        name="Scotch bonnet"
        price="$3.99"
        soldOut
        onAdd={() => {}}
      />
    </div>
    <div class="mt-4 flex flex-col gap-3">
      <MenuItemCard
        layout="row"
        name="Egusi seeds"
        description="1kg bag"
        price="$12.00"
        onAdd={() => {}}
      />
      <MenuItemCard
        layout="row"
        name="Palm oil"
        description="1L"
        price="$8.50"
        soldOut
        onAdd={() => {}}
      />
    </div>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Carousel</h2>
    <Carousel>
      {#each ["Rice", "Beans", "Spices", "Oils", "Snacks"] as label (label)}
        <div class="w-48 shrink-0">
          <PhotoPlaceholder
            {label}
            class="aspect-square w-full rounded-surface"
          />
        </div>
      {/each}
    </Carousel>
  </Section>

  <Section>
    <h2 class="type-script text-green mb-4">Breadcrumbs &amp; cart lines</h2>
    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: "Egusi seeds" },
      ]}
    />
    <Card class="mt-4 sm:max-w-md">
      <CartLine
        name="Egusi seeds"
        quantity={2}
        price="$24.00"
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <CartLine
        name="Palm oil"
        quantity={1}
        price="$8.50"
        onRemove={() => {}}
      />
    </Card>
  </Section>

  <Section tone="white">
    <h2 class="type-script text-green mb-4">Overlays</h2>
    <div class="flex gap-3">
      <Button onclick={() => (modalOpen = true)}>Open modal</Button>
      <Button variant="secondary" onclick={() => (drawerOpen = true)}
        >Open drawer</Button
      >
    </div>
  </Section>

  <Modal
    open={modalOpen}
    title="Example modal"
    onclose={() => (modalOpen = false)}
  >
    <div class="p-4">
      <p class="type-body">Modal body content.</p>
      <Button class="mt-4" onclick={() => (modalOpen = false)}>Close</Button>
    </div>
  </Modal>

  <Drawer
    open={drawerOpen}
    title="Example drawer"
    onclose={() => (drawerOpen = false)}
  >
    <p class="type-body">Drawer body content.</p>
  </Drawer>

  <SectionDivider tone="green" />
  <!-- <MotifBand /> -->

  <Footer />
</div>

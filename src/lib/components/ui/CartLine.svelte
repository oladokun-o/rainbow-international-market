<script lang="ts">
  /** One item row inside the bag or order summary. Quantity is a static
   * "N ·" prefix, not a live stepper — changing it goes through Edit
   * (reopens the item detail, which has its own quantity control), so
   * there's one place quantity/notes are ever set, not two. */
  interface Props {
    name: string;
    /** Chosen options, joined with a middot for display. */
    modifiers?: string[];
    quantity?: number;
    /** Pre-formatted line total, e.g. "$32.00". */
    price: string;
    onRemove?: () => void;
    /** Reopens the item detail for this line, pre-filled. Omitted on a
     * read-only review/confirmation screen, where there's nothing to edit. */
    onEdit?: () => void;
  }

  let { name, modifiers = [], quantity = 1, price, onRemove, onEdit }: Props = $props();
</script>

<div class="flex flex-col gap-1 py-3">
  <div class="flex items-start justify-between gap-3">
    <p class="min-w-0 flex-1 text-[14px] font-semibold text-deep">
      {quantity} · {name}
    </p>
    <span class="shrink-0 text-[14px] font-semibold text-deep">{price}</span>
  </div>
  {#if modifiers.length > 0}
    <p class="type-caption truncate text-deep/50">{modifiers.join(' · ')}</p>
  {/if}
  {#if onEdit || onRemove}
    <div class="mt-1 flex gap-4">
      {#if onEdit}
        <button
          type="button"
          onclick={onEdit}
          class="type-caption font-semibold text-green hover:text-deep"
        >
          Edit
        </button>
      {/if}
      {#if onRemove}
        <button
          type="button"
          onclick={onRemove}
          class="type-caption font-semibold text-green hover:text-deep"
        >
          Remove
        </button>
      {/if}
    </div>
  {/if}
</div>

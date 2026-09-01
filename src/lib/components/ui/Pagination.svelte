<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import Button from './Button.svelte';
  import Select from './Select.svelte';

  interface Props {
    page: number;
    limit: number;
    total: number;
  }

  let { page: currentPage, limit = 10, total }: Props = $props();

  const totalPages = $derived(Math.max(1, Math.ceil(total / limit)));
  const rangeStart = $derived(total === 0 ? 0 : (currentPage - 1) * limit + 1);
  const rangeEnd = $derived(Math.min(currentPage * limit, total));

  const limitOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' }
  ];

  // Intentionally captures only the initial value; the effect below keeps
  // it in sync with the `limit` prop on every subsequent change.
  let selectedLimit = $state(untrack(() => String(limit)));

  function go(nextPage: number, nextLimit?: number) {
    const url = new URL(page.url);
    url.searchParams.set('page', String(nextPage));
    if (nextLimit !== undefined) {
      url.searchParams.set('limit', String(nextLimit));
    }
    goto(url, { keepFocus: true, noScroll: true });
  }

  $effect(() => {
    // Sync prop to state
    selectedLimit = String(limit);
  });

  $effect(() => {
    // Navigate only if user selected a different limit than current.
    // The whole check + go() call is untracked: go() reads page.url, and
    // without this, that read becomes a dependency of this effect too,
    // so goto()'s own navigation re-triggers it in an infinite loop.
    const selectedNum = Number(selectedLimit);
    untrack(() => {
      if (selectedNum !== limit && selectedNum > 0) {
        go(1, selectedNum);
      }
    });
  });
</script>

<div
  class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between type-caption text-deep/60"
>
  <span>Showing {rangeStart}–{rangeEnd} of {total}</span>
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <label for="pagination-limit" class="text-deep/60">Per page:</label>
      <div class="w-20">
        <Select
          id="pagination-limit"
          options={limitOptions}
          bind:value={selectedLimit}
          ariaLabel="Items per page"
        />
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        disabled={currentPage <= 1}
        onclick={() => go(currentPage - 1, limit)}
      >
        Prev
      </Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button
        size="sm"
        variant="secondary"
        disabled={currentPage >= totalPages}
        onclick={() => go(currentPage + 1, limit)}
      >
        Next
      </Button>
    </div>
  </div>
</div>

<script lang="ts">
  import { cn } from '$lib/utils';

  /**
   * Labelled text input on the cream surface.
   *
   * Self-validation: pass `validate` (returns an error string, or null/undefined
   * when valid) and pick `validateOn` ('blur' | 'input', default 'blur'). Once a
   * message is showing it re-checks on input so it clears live. An external
   * `error` prop always wins over the internal result.
   */
  interface Props {
    label?: string;
    /** Accessible name when there's no visible `label` (e.g. a compact
     * single-row capture bar whose surrounding copy already implies the
     * field's purpose) — same convention as Select's `ariaLabel`. */
    ariaLabel?: string;
    type?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';
    name?: string;
    id?: string;
    value?: string;
    placeholder?: string;
    required?: boolean;
    requiredMessage?: string;
    disabled?: boolean;
    autocomplete?: HTMLInputElement['autocomplete'];
    error?: string;
    hint?: string;
    validate?: (_value: string) => string | null | undefined;
    validateOn?: 'blur' | 'input';
    /** 'full' (default) is the standalone pill — matches Button.
     * '2xl' matches Select/Textarea's corner radius, for forms that mix Input
     * with either of those and need one consistent field shape. */
    rounded?: 'full' | '2xl';
    class?: string;
    inputClass?: string;
    onblur?: (_event: FocusEvent) => void;
  }

  let {
    label,
    ariaLabel,
    type = 'text',
    name,
    id = name,
    value = $bindable(''),
    placeholder,
    required = false,
    requiredMessage = 'This field is required',
    disabled = false,
    autocomplete,
    error,
    hint,
    validate,
    validateOn = 'blur',
    rounded = 'full',
    class: className,
    inputClass,
    onblur
  }: Props = $props();

  let internalError = $state<string | undefined>(undefined);
  const shownError = $derived(error ?? internalError);

  function runValidate() {
    const custom = validate?.(value) ?? undefined;
    internalError = custom ?? (required && value.trim() === '' ? requiredMessage : undefined);
  }
  function handleBlur(event: FocusEvent) {
    if (validateOn === 'blur') runValidate();
    onblur?.(event);
  }
  function handleInput() {
    if (validateOn === 'input' || internalError) runValidate();
  }

  const messageId = $derived(id && (shownError || hint) ? `${id}-msg` : undefined);
</script>

<div class={cn('flex flex-col gap-2', className)}>
  {#if label}
    <label for={id} class="type-caption font-semibold text-deep">{label}</label>
  {/if}
  <input
    {id}
    {name}
    {type}
    {placeholder}
    {required}
    {disabled}
    {autocomplete}
    aria-label={ariaLabel}
    bind:value
    oninput={handleInput}
    onblur={handleBlur}
    aria-invalid={shownError ? 'true' : undefined}
    aria-describedby={messageId}
    class={cn(
      'h-12 w-full bg-white/60 border-2 px-4 font-body text-[15px] text-deep',
      rounded === 'full' ? 'rounded-full' : 'rounded-2xl',
      'placeholder:text-deep/40 transition-colors',
      'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      shownError ? 'border-green' : 'border-deep/20 focus:border-deep',
      inputClass
    )}
  />
  {#if shownError}
    <p id={messageId} class="type-caption text-green" role="alert">{shownError}</p>
  {:else if hint}
    <p id={messageId} class="type-caption text-deep/60">{hint}</p>
  {/if}
</div>

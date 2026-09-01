<script lang="ts">
  import { cn } from '$lib/utils';

  /**
   * Multi-line counterpart to Input — same labelled-field shell, validation
   * behavior, and error/hint slot underneath.
   *
   * Self-validation: pass `validate` (returns an error string, or null/undefined
   * when valid) and pick `validateOn` ('blur' | 'input', default 'blur'). Once a
   * message is showing it re-checks on input so it clears live. An external
   * `error` prop always wins over the internal result.
   */
  interface Props {
    label?: string;
    /** Rendered in sentence case after the label, e.g. "optional". */
    optionalNote?: string;
    name?: string;
    id?: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    required?: boolean;
    requiredMessage?: string;
    disabled?: boolean;
    error?: string;
    hint?: string;
    validate?: (_value: string) => string | null | undefined;
    validateOn?: 'blur' | 'input';
    class?: string;
    textareaClass?: string;
    onblur?: (_event: FocusEvent) => void;
  }

  let {
    label,
    optionalNote,
    name,
    id = name,
    value = $bindable(''),
    placeholder,
    rows = 4,
    maxLength,
    required = false,
    requiredMessage = 'This field is required',
    disabled = false,
    error,
    hint,
    validate,
    validateOn = 'blur',
    class: className,
    textareaClass,
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
    <label for={id} class="type-caption font-semibold text-deep">
      {label}
      {#if optionalNote}
        <span class="normal-case font-normal opacity-70">({optionalNote})</span>
      {/if}
    </label>
  {/if}
  <textarea
    {id}
    {name}
    {placeholder}
    {rows}
    maxlength={maxLength}
    {required}
    {disabled}
    bind:value
    oninput={handleInput}
    onblur={handleBlur}
    aria-invalid={shownError ? 'true' : undefined}
    aria-describedby={messageId}
    class={cn(
      'w-full rounded-2xl bg-white/60 border-2 px-4 py-3 font-body text-[15px] text-deep',
      'placeholder:text-deep/40 transition-colors resize-y',
      'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      shownError ? 'border-green' : 'border-deep/20 focus:border-deep',
      textareaClass
    )}
  ></textarea>
  {#if shownError}
    <p id={messageId} class="type-caption text-green" role="alert">{shownError}</p>
  {:else if hint}
    <p id={messageId} class="type-caption text-deep/60">{hint}</p>
  {/if}
</div>

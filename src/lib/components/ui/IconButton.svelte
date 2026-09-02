<script lang="ts">
  import { cn } from '$lib/utils';
  import Icon, { type IconName } from './Icon.svelte';

  /**
   * Icon-only control for close buttons, quantity steppers, and table row
   * actions. `label` is required — it's the only accessible name the
   * button has, since it never renders visible text.
   */
  type Variant = 'ghost' | 'solid' | 'outline' | 'danger';
  type Size = 'sm' | 'md' | 'lg';

  interface Props {
    icon: IconName;
    label: string;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    onclick?: (_event: MouseEvent) => void;
  }

  let {
    icon,
    label,
    variant = 'ghost',
    size = 'md',
    disabled = false,
    type = 'button',
    class: className,
    onclick
  }: Props = $props();

  const sizeMap: Record<Size, string> = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-11'
  };

  const iconSizeMap: Record<Size, number> = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const variantMap: Record<Variant, string> = {
    ghost: 'bg-transparent text-deep/70 hover:text-deep',
    solid: 'bg-green text-cream hover:bg-deep',
    outline: 'border-2 border-deep/20 text-deep hover:border-deep',
    danger: 'bg-green/10 text-green hover:bg-green hover:text-cream'
  };

  const classes = $derived(
    cn(
      'grid shrink-0 place-items-center rounded-control transition-colors duration-normal',
      'disabled:cursor-not-allowed disabled:opacity-40',
      sizeMap[size],
      variantMap[variant],
      className
    )
  );
</script>

<button {type} {disabled} {onclick} class={classes} aria-label={label} title={label}>
  <Icon name={icon} size={iconSizeMap[size]} />
</button>

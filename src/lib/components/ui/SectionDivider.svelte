<script lang="ts">
  import { cn } from '$lib/utils';

  /**
   * Torn-edge transition between two sections — a solid-color block tearing
   * into the section below it, instead of a flat rectangular edge. Place at
   * the bottom of the colored section it belongs to; the jagged edge reveals
   * whatever comes next.
   */
  type Tone = 'green' | 'deep' | 'cream' | 'white';

  interface Props {
    /** Which section color this divider tears away from. */
    tone?: Tone;
    /** Flip the jagged edge to the top instead of the bottom. */
    flip?: boolean;
    height?: number;
    /** Background behind the transparent (un-jagged) side — must match
     * whatever section actually sits there, or the seam shows a mismatched
     * color band. Defaults to nothing (bare page background), which only
     * looks right when the adjoining section is truly flat cream — pass an
     * explicit class (e.g. "bg-white/40") when it isn't. */
    bgClass?: string;
    class?: string;
  }

  let {
    tone = 'green',
    flip = false,
    height = 48,
    bgClass = '',
    class: className
  }: Props = $props();

  const toneClass: Record<Tone, string> = {
    green: 'fill-green',
    deep: 'fill-deep',
    cream: 'fill-cream',
    white: 'fill-white/40'
  };
</script>

<svg
  class={cn('block w-full', bgClass, flip && 'rotate-180', className)}
  style="height: {height}px"
  viewBox="0 0 1200 60"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path
    class={toneClass[tone]}
    d="M0,10 L50,18 L100,4 L150,20 L200,6 L250,24 L300,8 L350,18 L400,4 L450,20 L500,6 L550,22 L600,8 L650,24 L700,10 L750,26 L800,12 L850,28 L900,14 L950,32 L1000,18 L1050,34 L1100,16 L1150,30 L1200,22 L1200,60 L0,60 Z"
  />
</svg>

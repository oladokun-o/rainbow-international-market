import type { TransitionConfig } from 'svelte/transition';
import type { Action } from 'svelte/action';

/**
 * Dropdown/menu-panel entrance, per the Motion Library's
 * dropdown-location-switcher spec: drops 6px and scales from 0.98 to 1.
 */
export function dropdownMenu(node: Element, params: { duration?: number } = {}): TransitionConfig {
  const duration = params.duration ?? 150;
  return {
    duration,
    css: (t) => {
      const eased = t;
      return `opacity: ${eased}; transform: translateY(${(1 - eased) * -6}px) scale(${0.98 + eased * 0.02});`;
    }
  };
}

/**
 * Toast rise-in / drop-out, per the Motion Library's toasts-order-status
 * spec: rises 20px with a 0.98 scale on the way in, leaves 8px down.
 */
export function toastIn(node: Element, params: { duration?: number } = {}): TransitionConfig {
  const duration = params.duration ?? 300;
  return {
    duration,
    css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * 20}px) scale(${0.98 + t * 0.02});`
  };
}

export function toastOut(node: Element, params: { duration?: number } = {}): TransitionConfig {
  const duration = params.duration ?? 200;
  return {
    duration,
    css: (t) => `opacity: ${t}; transform: translateY(${(1 - t) * 8}px);`
  };
}

/**
 * Cascade reveal, per the Motion Library's cascade-reveal spec: "scroll-
 * triggered, staggered" — not a fire-on-mount animation. Adds `.in-view` the
 * first time the element crosses into the viewport (one-time, then
 * unobserves), which is what actually plays the CSS transition defined by
 * `.reveal`/`.reveal-delay-*` in app.css. Use on any element carrying those
 * classes; without this action they stay at their pre-reveal (opacity: 0)
 * state forever, since nothing else adds `.in-view`.
 */
export const revealOnScroll: Action = (node) => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          node.classList.add('in-view');
          observer.unobserve(node);
        }
      }
    },
    { threshold: 0.15 }
  );
  observer.observe(node);
  return {
    destroy() {
      observer.disconnect();
    }
  };
};

/**
 * Scroll-linked parallax — moves the node at `factor` × scroll distance via a
 * `--parallax-y` custom property, so the page's own inline `transform` can
 * compose it with a fixed rotate (e.g.
 * `translateY(var(--parallax-y, 0px)) rotate(18deg)`). Disabled for
 * prefers-reduced-motion (the decoration stays put instead of moving).
 */
export function parallax(node: HTMLElement, factor: number) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentFactor = factor;

  function apply() {
    const y = mq.matches ? 0 : window.scrollY * currentFactor;
    node.style.setProperty('--parallax-y', `${y}px`);
  }

  window.addEventListener('scroll', apply, { passive: true });
  mq.addEventListener('change', apply);
  apply();

  return {
    update(f: number) {
      currentFactor = f;
      apply();
    },
    destroy() {
      window.removeEventListener('scroll', apply);
      mq.removeEventListener('change', apply);
    }
  };
}

/**
 * Edge-panel slide, per the Motion Library's edge-panel-cart-drawer spec:
 * panel translateX 100% to 0 (from the given `side`).
 */
export function drawerSlide(
  node: Element,
  params: { side?: 'left' | 'right'; duration?: number } = {}
): TransitionConfig {
  const side = params.side ?? 'right';
  const duration = params.duration ?? 300;
  const sign = side === 'right' ? 1 : -1;
  return {
    duration,
    css: (t) => `transform: translateX(${(1 - t) * sign * 100}%);`
  };
}

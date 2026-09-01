<script module lang="ts">
  export type IconName =
    | 'chevron-down'
    | 'chevron-up'
    | 'chevron-right'
    | 'chevron-left'
    | 'x'
    | 'check'
    | 'plus'
    | 'minus'
    | 'search'
    | 'file'
    | 'cart'
    | 'map-pin'
    | 'phone'
    | 'clock'
    | 'menu'
    | 'arrow-right'
    | 'trash'
    | 'download'
    | 'mail'
    | 'star'
    | 'user'
    | 'grid'
    | 'list'
    | 'edit'
    | 'share'
    | 'directions'
    | 'alert';
</script>

<script lang="ts">
  import {
    ChevronDown,
    ChevronUp,
    ChevronRight,
    ChevronLeft,
    X,
    Check,
    Plus,
    Minus,
    Search,
    File,
    ShoppingCart,
    MapPin,
    Phone,
    Clock,
    Menu,
    ArrowRight,
    Trash2,
    Download,
    Mail,
    Star,
    User,
    LayoutGrid,
    List,
    Pencil,
    Share2,
    Navigation,
    TriangleAlert
  } from '@lucide/svelte';

  /** 2px-stroke UI chrome glyph in currentColor. */
  interface Props {
    name: IconName;
    size?: number;
    strokeWidth?: number;
    class?: string;
  }

  let { name, size = 16, strokeWidth = 2, class: className }: Props = $props();

  const icons = {
    'chevron-down': ChevronDown,
    'chevron-up': ChevronUp,
    'chevron-right': ChevronRight,
    'chevron-left': ChevronLeft,
    x: X,
    check: Check,
    plus: Plus,
    minus: Minus,
    search: Search,
    file: File,
    cart: ShoppingCart,
    'map-pin': MapPin,
    phone: Phone,
    clock: Clock,
    menu: Menu,
    'arrow-right': ArrowRight,
    trash: Trash2,
    download: Download,
    mail: Mail,
    star: Star,
    user: User,
    grid: LayoutGrid,
    list: List,
    edit: Pencil,
    share: Share2,
    directions: Navigation,
    alert: TriangleAlert
  } satisfies Record<IconName, typeof ChevronDown>;

  const IconComponent = $derived(icons[name]);
</script>

<IconComponent {size} {strokeWidth} class={className} aria-hidden="true" />

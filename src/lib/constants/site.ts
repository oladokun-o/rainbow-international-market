// Canonical site-wide metadata. Single source of truth for URLs, brand names,
// social links, and contact details used by SEO and the page layout.

// TODO confirm domain
export const SITE_URL = 'https://rainbowinternationalmarket.com';
export const SITE_NAME = 'Rainbow International Market';
export const SITE_DESCRIPTION =
  'African, Caribbean, Asian & international grocery store in San Angelo, TX. ' +
  'Browse the catalogue and reserve for cash-on-pickup.';

// Cuisine/keyword terms used for SEO copy and structured data — kept in one
// place so meta tags and JSON-LD never fall out of sync.
export const SEO_KEYWORDS = [
  'African grocery',
  'Caribbean grocery',
  'Asian grocery',
  'international market',
  'San Angelo Texas',
  'African food store'
] as const;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/myrainbowmarket/',
  tiktok: '',
  facebook: ''
} as const;

// Default social-share image (1200×630), composed from brand vectors + fonts.
export const SITE_OG_IMAGE = '/og/og-default.png';

// Company-wide, not per-location — one inbox regardless of how many
// storefronts exist.
// TODO confirm real address
export const CONTACT_EMAIL = 'hello@rainbowinternationalmarket.com';

/** One day-group's hours — `display` for people, `open`/`close` (24h "HH:mm")
 * for `isLocationOpenNow` to actually compute against. */
interface HoursWindow {
  display: string;
  open: string;
  close: string;
}

export interface Location {
  id: string;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  /** "streetAddress, city, state postalCode" */
  address: string;
  phone: string;
  phoneHref: string;
  /** IANA zone, e.g. "America/Chicago" — open/closed is computed in the
   * location's own timezone, not the visitor's. */
  timeZone: string;
  /** Real coordinates (geocoded from the street address), for the location
   * picker's "near me" distance — not an approximation. */
  lat: number;
  lng: number;
  /** Structured so weekend hours can differ from weekdays without a data
   * model change. */
  hours: {
    weekdays: HoursWindow;
    saturday: HoursWindow;
    sunday: HoursWindow;
  };
}

// Full USPS state/territory abbreviation → name table — used wherever a
// location's state needs to be matched or displayed by its full name. Kept
// complete rather than only listing states we currently operate in, so it
// never needs a follow-up edit when a new location's state shows up.
export const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  AS: 'American Samoa',
  GU: 'Guam',
  MP: 'Northern Mariana Islands',
  PR: 'Puerto Rico',
  VI: 'U.S. Virgin Islands'
};

// One confirmed storefront today; adding a second location is a data change
// here, not a rewrite of the pages that read from it (Home, Footer, Contact
// all key off this array / PRIMARY_LOCATION instead of a hardcoded address).
// TODO real address + coords + hours from client
export const LOCATIONS: Location[] = [
  {
    id: 'san-angelo',
    name: 'San Angelo',
    streetAddress: 'San Angelo, TX',
    city: 'San Angelo',
    state: 'TX',
    postalCode: '',
    address: 'San Angelo, TX',
    phone: '',
    phoneHref: '',
    timeZone: 'America/Chicago',
    lat: 31.4638,
    lng: -100.437,
    hours: {
      weekdays: { display: '9 AM – 8 PM', open: '09:00', close: '20:00' },
      saturday: { display: '9 AM – 8 PM', open: '09:00', close: '20:00' },
      sunday: { display: '10 AM – 6 PM', open: '10:00', close: '18:00' }
    }
  }
];

/** The flagship location — used wherever a page needs to show "the" address/
 * phone (JSON-LD, the footer credit line, Contact) ahead of a real Locations
 * page existing. Once LOCATIONS has more than one entry, those call sites
 * become a picker instead of an implicit single choice. */
export const PRIMARY_LOCATION = LOCATIONS[0];

/** Single-line hours summary for spots that only have room for one string.
 * Collapses to "Monday – Sunday, ..." when every day matches; otherwise
 * breaks out weekdays/Saturday/Sunday. */
export function formatHoursSummary(location: Location): string {
  const { weekdays, saturday, sunday } = location.hours;
  if (weekdays.display === saturday.display && saturday.display === sunday.display) {
    return `Monday – Sunday, ${weekdays.display}`;
  }
  if (saturday.display === sunday.display) {
    return `Mon – Fri ${weekdays.display} · Sat – Sun ${saturday.display}`;
  }
  return `Mon – Fri ${weekdays.display} · Sat ${saturday.display} · Sun ${sunday.display}`;
}

const DAY_WINDOW: Record<number, keyof Location['hours']> = {
  0: 'sunday',
  1: 'weekdays',
  2: 'weekdays',
  3: 'weekdays',
  4: 'weekdays',
  5: 'weekdays',
  6: 'saturday'
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Current minutes-since-midnight in `location`'s own timezone, plus that
 * day's hours window — the one place both `isLocationOpenNow` and
 * `locationStatus` read the clock from, so they can never disagree. */
function todayWindowState(
  location: Location,
  now: Date
): { currentMinutes: number; window: HoursWindow } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: location.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now);

  const weekdayShort = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  // Intl can render midnight as "24" in some locales/environments.
  const currentMinutes = (Number(hour) % 24) * 60 + Number(minute);

  const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayShort);
  const window = location.hours[DAY_WINDOW[weekdayIndex] ?? 'weekdays'];

  return { currentMinutes, window };
}

/** Whether `location` is open right now, computed in the location's own
 * timezone (not the visitor's) against its hours. */
export function isLocationOpenNow(location: Location, now: Date = new Date()): boolean {
  const { currentMinutes, window } = todayWindowState(location, now);
  return currentMinutes >= toMinutes(window.open) && currentMinutes < toMinutes(window.close);
}

function to12Hour(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minuteLabel = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
  return `${hour12}${minuteLabel} ${period}`;
}

export interface LocationStatus {
  label: string;
  tone: 'success' | 'progress' | 'outline';
}

/** Real-time status pill for the location picker: "Open till 9 PM" normally,
 * "Closes in N min" once genuinely close to closing, "Closed · opens ..."
 * otherwise. */
export function locationStatus(location: Location, now: Date = new Date()): LocationStatus {
  const { currentMinutes, window } = todayWindowState(location, now);
  const openMinutes = toMinutes(window.open);
  const closeMinutes = toMinutes(window.close);

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const minutesLeft = closeMinutes - currentMinutes;
    if (minutesLeft <= 30) {
      return { label: `Closes in ${minutesLeft} min`, tone: 'progress' };
    }
    return { label: `Open till ${to12Hour(window.close)}`, tone: 'success' };
  }
  return { label: `Closed · opens ${nextOpenLabel(location, now)}`, tone: 'outline' };
}

/** "today at 11:00 AM" / "tomorrow at 11:00 AM" — for the closed-state banner.
 * Only meaningful to call when `isLocationOpenNow` is false. */
export function nextOpenLabel(location: Location, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: location.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(now);

  const weekdayShort = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const currentMinutes = hour * 60 + minute;

  const weekdayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayShort);
  const todayWindow = location.hours[DAY_WINDOW[weekdayIndex] ?? 'weekdays'];
  const todayOpenMinutes =
    Number(todayWindow.open.split(':')[0]) * 60 + Number(todayWindow.open.split(':')[1]);

  const formatOpenTime = (dayLabel: string, window: HoursWindow) => {
    const [h, m] = window.open.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const minuteLabel = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
    return `${dayLabel} at ${hour12}${minuteLabel} ${period}`;
  };

  if (currentMinutes < todayOpenMinutes) {
    return formatOpenTime('today', todayWindow);
  }
  const tomorrowIndex = (weekdayIndex + 1) % 7;
  const tomorrowWindow = location.hours[DAY_WINDOW[tomorrowIndex] ?? 'weekdays'];
  return formatOpenTime('tomorrow', tomorrowWindow);
}

/** City/ZIP/state search match, case-insensitive substring — shared by any
 * page that filters locations so they never drift apart. */
export function matchesLocationQuery(location: Location, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;
  const haystack = [
    location.name,
    location.city,
    location.state,
    US_STATE_NAMES[location.state] ?? '',
    location.postalCode
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

// Site-wide "is ordering live" switch. `Header` defaults its `orderHref` prop
// to this, so no page has to remember to pass one — flipping this one constant
// turns the Shop CTA on everywhere at once.
export const ORDER_HREF: string | null = '/shop';

// Primary marketing-site nav — one source shared by the header (desktop nav +
// mobile drawer both render the same list) and the footer.
export const MARKETING_NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
] as const;

// Product category chapters — shared between the shop's own section ids and
// the footer's category link column, so the two never drift apart.
export const PRODUCT_CATEGORIES = [
  { label: 'Groceries', slug: 'groceries' },
  { label: 'Fresh Produce', slug: 'fresh-produce' },
  { label: 'Frozen Foods', slug: 'frozen-foods' },
  { label: 'Beverages', slug: 'beverages' },
  { label: 'Household Essentials', slug: 'household-essentials' },
  { label: 'Prepared Food', slug: 'prepared-food' }
] as const;

/** schema.org GroceryStore structured data for the homepage. `origin` is the
 * live request origin so URLs are host-correct on previews and production. */
export function groceryStoreJsonLd(origin: string): Record<string, unknown> {
  const loc = PRIMARY_LOCATION;
  const sameAs = Object.values(SOCIAL_LINKS).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: origin,
    ...(sameAs.length ? { sameAs } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.streetAddress,
      addressLocality: loc.city,
      addressRegion: loc.state,
      ...(loc.postalCode ? { postalCode: loc.postalCode } : {}),
      addressCountry: 'US'
    },
    ...(loc.phone ? { telephone: loc.phone } : {}),
    ...(loc.lat && loc.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: loc.lat, longitude: loc.lng } }
      : {}),
    areaServed: 'San Angelo, TX'
  };
}

// Pickup-date helpers, shared by client and server. Dates are ISO 'YYYY-MM-DD'
// strings and all arithmetic is done in UTC so a browser's timezone can never
// shift which calendar day a pickup lands on.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoPickupDate(value: string | null | undefined): value is string {
  return typeof value === 'string' && ISO_DATE.test(value);
}

/** "Saturday, September 6, 2025" — or the raw string if it isn't an ISO date. */
export function formatPickupDateLabel(value: string | null | undefined): string {
  if (!isIsoPickupDate(value)) return value ?? 'To be confirmed';
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * The next `count` ISO dates (starting tomorrow) whose weekday is in
 * `pickupDays` (0 = Sunday … 6 = Saturday). If `pickupDays` is empty, every
 * upcoming day qualifies.
 */
export function nextPickupDates(pickupDays: number[], count = 14): string[] {
  const allowed = pickupDays.length > 0 ? new Set(pickupDays) : null;
  const out: string[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  // Scan at most ~10 weeks out to fill `count`.
  for (let i = 1; i <= 70 && out.length < count; i++) {
    const day = new Date(cursor);
    day.setUTCDate(day.getUTCDate() + i);
    if (!allowed || allowed.has(day.getUTCDay())) {
      out.push(toIso(day));
    }
  }
  return out;
}

/** Whether an ISO date is in the future and on an allowed pickup weekday. */
export function isValidPickupDate(value: string, pickupDays: number[]): boolean {
  if (!isIsoPickupDate(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (parsed.getTime() <= today.getTime()) return false;

  if (pickupDays.length > 0 && !pickupDays.includes(parsed.getUTCDay())) return false;
  return true;
}

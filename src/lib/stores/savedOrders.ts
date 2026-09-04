// Device-local "my orders" session — plain localStorage helpers, not a rune
// store (nothing here needs reactivity outside the /my-orders page itself).
// There are no customer accounts: this is how someone on the same device
// finds their orders again without a login, verified by email + the last 4
// digits of their phone number (checked server-side in /api/orders/lookup).

export interface SavedOrder {
  orderRef: string;
  status: string;
  pickupDate: string;
  totalCents: number;
  itemCount: number;
  createdAt: string;
}

interface OrderSession {
  email: string;
  phoneLast4: string;
  expires: number;
}

const ORDERS_KEY = 'rim-orders';
const SESSION_KEY = 'rim-orders-session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const TERMINAL = new Set(['collected', 'cancelled']);

// ── Session ──────────────────────────────────────────────────────────

export function getSession(): OrderSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as OrderSession;
    if (!session || session.expires < Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setSession(email: string, phoneLast4: string): void {
  try {
    const session: OrderSession = { email, phoneLast4, expires: Date.now() + SESSION_TTL_MS };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Private browsing / storage disabled — the lookup form just re-asks next visit.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* no-op */
  }
}

// ── Cached orders ────────────────────────────────────────────────────

export function getSavedOrders(): SavedOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: SavedOrder): void {
  try {
    const orders = getSavedOrders();
    const idx = orders.findIndex((o) => o.orderRef === order.orderRef);
    if (idx >= 0) orders[idx] = order;
    else orders.unshift(order); // newest first
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* no-op */
  }
}

export function replaceSavedOrders(orders: SavedOrder[]): void {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* no-op */
  }
}

export function getActiveOrders(): SavedOrder[] {
  return getSavedOrders().filter((o) => !TERMINAL.has(o.status));
}

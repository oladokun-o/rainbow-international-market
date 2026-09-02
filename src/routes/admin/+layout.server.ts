import { getSession, requireSession } from '$lib/server/session';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
  // The login page is the one /admin route that must stay reachable logged-out.
  if (event.url.pathname === '/admin/login') {
    return { session: getSession(event.cookies) };
  }
  const session = requireSession(event);
  return { session };
};

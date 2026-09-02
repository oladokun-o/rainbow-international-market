import { error, json } from '@sveltejs/kit';
import { getSession, canSetStatus } from '$lib/server/session';
import { setOrderStatus, OrderError } from '$lib/server/orders';
import type { OrderStatus } from '$lib/models/Order';
import type { RequestHandler } from './$types';

// Admin-only: update an order's status.
export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
  const session = getSession(cookies);
  if (!session) throw error(401, 'Not signed in.');

  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  const status = body?.status as OrderStatus | undefined;
  if (!status) throw error(400, 'Missing status.');

  if (!canSetStatus(session.role, status)) {
    throw error(403, `Your role cannot set an order to "${status}".`);
  }

  try {
    await setOrderStatus(params.id, status, session.name);
  } catch (e) {
    if (e instanceof OrderError) throw error(e.status, e.message);
    throw e;
  }

  return json({ ok: true, status });
};

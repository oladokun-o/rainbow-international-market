import { fail, redirect } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Order } from '$lib/models/Order';
import { isValidEmail } from '$lib/utils';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const ref = String(form.get('ref') ?? '')
      .trim()
      .toUpperCase();
    const email = String(form.get('email') ?? '')
      .trim()
      .toLowerCase();

    if (!ref) return fail(400, { error: 'Enter your order reference.', ref, email });
    if (!isValidEmail(email)) return fail(400, { error: 'Enter the email on the order.', ref, email });

    await connectDB();
    const order = await Order.findOne({ orderRef: ref, 'customer.email': email })
      .select('orderRef')
      .lean();

    if (!order) {
      return fail(404, {
        error: "We couldn't find an order with that reference and email.",
        ref,
        email
      });
    }

    throw redirect(303, `/track/${order.orderRef}`);
  }
};

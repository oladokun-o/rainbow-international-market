import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { connectDB } from '$lib/server/db';
import { User } from '$lib/models/User';
import { getSession, setSession } from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';

function safeNext(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/admin';
  return value;
}

export const load: PageServerLoad = ({ cookies, url }) => {
  if (getSession(cookies)) throw redirect(303, safeNext(url.searchParams.get('next')));
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '')
      .trim()
      .toLowerCase();
    const password = String(form.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { error: 'Enter your email and password.', email });
    }

    await connectDB();
    const user = await User.findOne({ email });
    const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !ok) {
      // Same message either way — don't reveal whether the email exists.
      return fail(401, { error: 'Incorrect email or password.', email });
    }

    setSession(cookies, { userId: user._id.toString(), role: user.role, name: user.name });
    throw redirect(303, safeNext(url.searchParams.get('next')));
  }
};

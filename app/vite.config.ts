import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// The .env file lives inside app/ (alongside this config). We deliberately do
// not set `envDir` — env files are colocated with the SvelteKit app.
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});

# Rainbow International Market

E-commerce storefront and ordering platform for Rainbow International Market — an
African / Caribbean / Asian / international grocery store in San Angelo, TX
(IG [@myrainbowmarket](https://instagram.com/myrainbowmarket)). Customers browse the
catalogue, build a cart, and place a **cash-on-pickup** order confirmed by email.
A small team manages products and marketing content in **Sanity Studio** (embedded
at `/studio`) and processes orders in a custom `/admin` dashboard.

## Stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes only) |
| Styling | Tailwind CSS v4 (`@theme` in `src/app.css`, no config file) |
| Hosting | Vercel — `@sveltejs/adapter-vercel`, `nodejs22.x` runtime |
| Language | TypeScript, Node 22, npm |
| CMS | Sanity (`@sanity/sveltekit`) — catalogue + marketing content, embedded Studio |
| Orders datastore | MongoDB Atlas (Mongoose) |
| Payments | None — cash on pickup only |
| Email | Resend (skips gracefully when unset) |

## Getting started

The SvelteKit app lives in [`app/`](./app). All commands run from `app/`:

```bash
cd app
cp .env.example .env   # then fill in real values
npm install
npm run dev
```

## Commands (run from `app/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (emits `.vercel/output/`) |
| `npm run preview` | Preview the production build locally |
| `npm run check` | `svelte-kit sync` + `svelte-check` type checking |

## Environment

`.env` lives **inside `app/`** (colocated with the SvelteKit app — `vite.config.ts`
does not set `envDir`). See [`app/.env.example`](./app/.env.example) for every
variable this project uses. Secrets are never committed; the team pastes real
values into `.env` locally and into the Vercel project settings for deploys.

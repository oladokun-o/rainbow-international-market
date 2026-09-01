// Content seed for the Sanity dataset — categories, sample products, and the
// singleton siteSettings document.
//
// This is a standalone build/ops script, NOT application code, so it imports
// `@sanity/client` directly (the one place in the repo that's allowed to —
// app code goes through `@sanity/sveltekit`).
//
// Run:  npm run seed        (which is `node --env-file=.env scripts/seed.mjs`)
//
// Requires a write-capable token in `.env` as SANITY_WRITE_TOKEN (Editor role).
// The read token used by the app cannot write. All writes use `createOrReplace`
// with deterministic ids, so the script is idempotent — safe to re-run.

import { createClient } from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error(
    '\n✗ Set SANITY_WRITE_TOKEN (Editor role) in .env — the read token won\'t work for writes.\n' +
      '  sanity.io/manage → API → Tokens → Add token → Editor, then add it to .env as SANITY_WRITE_TOKEN.\n'
  );
  process.exit(1);
}

if (!projectId || !dataset) {
  console.error('\n✗ PUBLIC_SANITY_PROJECT_ID and PUBLIC_SANITY_DATASET must be set in .env.\n');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-15',
  token,
  useCdn: false
});

// ── Helpers ──────────────────────────────────────────────────────────
let keySeq = 0;
/** A single Portable Text block holding one plain paragraph. */
function textBlock(text) {
  keySeq += 1;
  return [
    {
      _type: 'block',
      _key: `seedblock${keySeq}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `seedspan${keySeq}`, text, marks: [] }]
    }
  ];
}

const categoryRef = (slug) => ({ _type: 'reference', _ref: `category.${slug}` });

// ── Categories (PHASE-3-HANDOFF §a) ──────────────────────────────────
const categories = [
  { slug: 'groceries', title: 'Groceries', sortOrder: 0 },
  { slug: 'fresh-produce', title: 'Fresh Produce', sortOrder: 1 },
  { slug: 'frozen-foods', title: 'Frozen Foods', sortOrder: 2 },
  { slug: 'beverages', title: 'Beverages', sortOrder: 3 },
  { slug: 'household-essentials', title: 'Household Essentials', sortOrder: 4 },
  { slug: 'prepared-food', title: 'Prepared Food', sortOrder: 5 }
].map((c) => ({
  _id: `category.${c.slug}`,
  _type: 'category',
  title: c.title,
  slug: { _type: 'slug', current: c.slug },
  sortOrder: c.sortOrder,
  description: `${c.title} from across Africa, the Caribbean, and Asia.`
}));

// ── Products (PHASE-3-HANDOFF §b) — prices are INTEGER CENTS ──────────
const products = [
  {
    _id: 'product.jollof-rice-spice-mix',
    name: 'Jollof Rice Spice Mix',
    slug: 'jollof-rice-spice-mix',
    category: 'groceries',
    type: 'grocery',
    price: 599,
    unit: '100g',
    featured: true,
    inStock: true,
    blurb: 'A balanced blend of smoked paprika, thyme, and pepper for a rich pot of party jollof.'
  },
  {
    _id: 'product.palm-oil',
    name: 'Palm Oil',
    slug: 'palm-oil',
    category: 'groceries',
    type: 'grocery',
    price: 1299,
    unit: '1L',
    inStock: true,
    blurb: 'Unrefined red palm oil pressed for deep colour and flavour in soups and stews.'
  },
  {
    _id: 'product.plantains',
    name: 'Plantains',
    slug: 'plantains',
    category: 'fresh-produce',
    type: 'grocery',
    price: 199,
    unit: 'each',
    inStock: true,
    stockQty: 3,
    lowStockThreshold: 5,
    blurb: 'Ripe yellow plantains, ready to fry into sweet, golden dodo.'
  },
  {
    _id: 'product.scotch-bonnet-peppers',
    name: 'Scotch Bonnet Peppers',
    slug: 'scotch-bonnet-peppers',
    category: 'fresh-produce',
    type: 'grocery',
    price: 349,
    unit: '250g',
    inStock: true,
    blurb: 'Fiery, fruity Scotch bonnets — the backbone of Caribbean and West African heat.'
  },
  {
    _id: 'product.frozen-cassava-leaves',
    name: 'Frozen Cassava Leaves',
    slug: 'frozen-cassava-leaves',
    category: 'frozen-foods',
    type: 'grocery',
    price: 649,
    unit: '500g',
    inStock: false,
    blurb: 'Finely pounded cassava leaves, frozen at their freshest for saka-saka and pondu.'
  },
  {
    _id: 'product.malta-guinness-6-pack',
    name: 'Malta Guinness (6-pack)',
    slug: 'malta-guinness-6-pack',
    category: 'beverages',
    type: 'grocery',
    price: 899,
    compareAtPrice: 1099,
    unit: '6-pack',
    featured: true,
    inStock: true,
    blurb: 'The classic non-alcoholic malt drink — dark, sweet, and best served cold.'
  },
  {
    _id: 'product.african-black-soap',
    name: 'African Black Soap',
    slug: 'african-black-soap',
    category: 'household-essentials',
    type: 'grocery',
    price: 499,
    unit: 'each',
    inStock: true,
    blurb: 'Handmade Ghanaian black soap with plantain ash and shea butter for gentle cleansing.'
  },
  {
    _id: 'product.egusi-soup-family-size',
    name: 'Egusi Soup (family size)',
    slug: 'egusi-soup-family-size',
    category: 'prepared-food',
    type: 'prepared',
    price: 2500,
    unit: 'serves 4',
    leadTimeNote: 'Ready in 24h',
    featured: true,
    inStock: true,
    blurb: 'Melon-seed soup simmered with leafy greens and assorted meat, cooked to order.'
  }
].map((p) => {
  const doc = {
    _id: p._id,
    _type: 'product',
    name: p.name,
    slug: { _type: 'slug', current: p.slug },
    type: p.type,
    category: categoryRef(p.category),
    description: textBlock(p.blurb),
    price: p.price,
    unit: p.unit,
    inStock: p.inStock,
    featured: Boolean(p.featured),
    sortOrder: 0
  };
  if (p.compareAtPrice != null) doc.compareAtPrice = p.compareAtPrice;
  if (p.stockQty != null) doc.stockQty = p.stockQty;
  if (p.lowStockThreshold != null) doc.lowStockThreshold = p.lowStockThreshold;
  if (p.leadTimeNote) doc.leadTimeNote = p.leadTimeNote;
  return doc;
});

// ── Site settings (PHASE-3-HANDOFF §c) ───────────────────────────────
// Address / phone / email are PLACEHOLDERS — replace with the real San Angelo
// values once confirmed with the client.
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  storeName: 'Rainbow International Market',
  pickupAddress: '123 Main Street, San Angelo, TX 76903 (provisional — confirm with client)',
  phone: '(325) 000-0000',
  email: 'hello@rainbowinternationalmarket.com',
  hoursNote: 'Open Tuesday to Saturday. Closed Sunday and Monday.',
  pickupInstructions:
    'Bring your order number to the front counter. Payment is cash on pickup. Prepared food needs 24 hours notice.',
  pickupDays: [2, 3, 4, 5, 6],
  pickupWindow: '10 AM – 6 PM',
  orderingEnabled: true,
  announcement: 'Now taking catalogue reservations for cash-on-pickup.',
  promoBanner: {
    enabled: false,
    headline: '',
    subtext: ''
  }
};

// ── Run ──────────────────────────────────────────────────────────────
async function run() {
  const tx = client.transaction();
  for (const doc of categories) tx.createOrReplace(doc);
  for (const doc of products) tx.createOrReplace(doc);
  tx.createOrReplace(siteSettings);
  await tx.commit();
  console.log(
    `\n✓ Seeded: ${categories.length} categories, ${products.length} products, settings ✓` +
      `\n  project ${projectId} · dataset ${dataset}\n`
  );
}

run().catch((err) => {
  console.error('\n✗ Seed failed:', err.message || err, '\n');
  process.exit(1);
});

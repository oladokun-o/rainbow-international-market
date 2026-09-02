// Creates the first admin (owner) account from env vars. Idempotent — running
// it again updates that user's name/password/role rather than erroring.
//
// Run:  npm run seed:admin        (node --env-file=.env scripts/seed-admin.mjs)
//
// Requires in .env:
//   MONGODB_URI, MONGODB_DB
//   ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { MONGODB_URI, MONGODB_DB, ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD } =
  process.env;

if (!MONGODB_URI) {
  console.error('\n✗ MONGODB_URI is not set in .env\n');
  process.exit(1);
}
if (!ADMIN_SEED_NAME || !ADMIN_SEED_EMAIL || !ADMIN_SEED_PASSWORD) {
  console.error(
    '\n✗ Set ADMIN_SEED_NAME, ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env\n'
  );
  process.exit(1);
}
if (ADMIN_SEED_PASSWORD.length < 10) {
  console.error('\n✗ ADMIN_SEED_PASSWORD must be at least 10 characters\n');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    passwordHash: String,
    role: { type: String, enum: ['owner', 'manager', 'staff'], default: 'staff' }
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB ?? 'rainbow' });
  const email = ADMIN_SEED_EMAIL.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(ADMIN_SEED_PASSWORD, 12);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.name = ADMIN_SEED_NAME;
    existing.passwordHash = passwordHash;
    existing.role = 'owner';
    await existing.save();
    console.log(`\n✓ Updated owner account: ${email}\n`);
  } else {
    await User.create({ name: ADMIN_SEED_NAME, email, passwordHash, role: 'owner' });
    console.log(`\n✓ Created owner account: ${email}\n`);
  }
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('\n✗ seed:admin failed:', err.message || err, '\n');
  process.exit(1);
});

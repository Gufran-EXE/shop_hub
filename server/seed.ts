/**
 * Seed script — populates MongoDB with the 16 products from static data.
 * Run: npm run seed
 */
import 'dotenv/config';
import { connectDB } from './db';
import { Product } from './models/Product';

// tsx can resolve .ts files with path aliases disabled — use relative path
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — importing from src works fine when run via tsx
import { products } from '../src/data/products';

async function seed() {
  await connectDB();

  console.log('🌱  Seeding products…');

  let inserted = 0;
  let skipped  = 0;

  for (const p of products) {
    const exists = await Product.findOne({ id: p.id });
    if (exists) {
      skipped++;
      continue;
    }
    await Product.create(p);
    inserted++;
    console.log(`   ✔  ${p.name}`);
  }

  console.log(`\n✅  Done — ${inserted} inserted, ${skipped} already existed.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});

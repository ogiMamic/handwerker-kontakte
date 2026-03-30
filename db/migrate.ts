// ============================================================
// DEPRECATED: Old handwerker/bewertungen table migration
// Data has been migrated to CraftsmanProfile (Prisma).
// Use `npx prisma migrate deploy` for schema changes.
// Use `npx tsx scripts/migrate-to-prisma.ts` for data migration.
// ============================================================

async function main() {
  console.log('⚠️  This migration script is deprecated.');
  console.log('   handwerker/bewertungen tables have been replaced by CraftsmanProfile (Prisma).');
  console.log('   Use: npx prisma migrate deploy');
  process.exit(0);
}

main();

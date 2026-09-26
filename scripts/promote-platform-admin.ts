/**
 * Operator-only CLI to grant/revoke platform-superadmin access.
 *
 * This is the *only* supported way to set User.isPlatformAdmin — there is
 * deliberately no API route or UI for it. Run manually, against a trusted
 * DATABASE_URL:
 *
 *   npx tsx scripts/promote-platform-admin.ts info@tunerportal.com
 *   npx tsx scripts/promote-platform-admin.ts info@tunerportal.com --revoke
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("Usage: npx tsx scripts/promote-platform-admin.ts <email> [--revoke]");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email "${email}". They must register an account first.`);
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isPlatformAdmin: !revoke },
  });

  console.log(
    `${revoke ? "Revoked" : "Granted"} platform admin for ${updated.email} (id: ${updated.id}).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

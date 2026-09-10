require('dotenv/config');
const { PrismaClient } = require('../src/generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting Tenant Status Backfill Migration...");

  // Get all tenants
  const tenants = await prisma.tenant.findMany({
    include: {
      users: true
    }
  });

  let migrated = 0;
  
  for (const tenant of tenants) {
    // Find the owner or first user to migrate status from
    const owner = tenant.users.find((u: any) => u.id === tenant.ownerId) || tenant.users[0];
    
    if (owner) {
      const statusToSet = owner.tenantStatus || 'pending';
      const onboardingToSet = owner.tenantOnboardingStatus || 'not_started';
      
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: {
          status: statusToSet,
          onboardingStatus: onboardingToSet
        }
      });
      migrated++;
    } else {
      // Tenant has no users, leave as defaults
    }
  }

  console.log(`Migration completed. Migrated ${migrated} tenants to new status columns.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

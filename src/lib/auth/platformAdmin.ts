import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the current platform superadmin, always re-checked against the
 * DB rather than trusted from the JWT — the same reasoning sessionContext.ts
 * already applies to tenant roles: `isPlatformAdmin` can be revoked by an
 * operator at any time, and a JWT can live for the full session lifetime,
 * so a stale token must not keep granting platform-wide access.
 */
export async function getPlatformAdminUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isPlatformAdmin) return null;

  return user;
}

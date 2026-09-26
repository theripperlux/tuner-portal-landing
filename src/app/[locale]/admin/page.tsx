import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { getPlatformAdminUser } from "@/lib/auth/platformAdmin";
import AdminClient from "./AdminClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin Platform | TunerPortal',
  description: 'Zentrale Verwaltung für Kunden, Preise, Zahlungen und KI-Automation im TunerPortal. Live-Dashboard für alle Tuning-Aufträge.',
  robots: {
    index: false, // Wichtig für Admin-Bereiche: Nicht in Google indexieren!
    follow: false
  }
};

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const adminUser = await getPlatformAdminUser();

  if (!adminUser) {
    redirect({ href: '/login', locale });
    return null;
  }

  const rawUsers = await prisma.user.findMany({
    include: { memberships: { include: { tenant: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // Never ship password hashes or plaintext portal passwords to the
  // browser — AdminClient is a client component, so any field left on
  // these objects is serialized straight into the page payload.
  const users = rawUsers.map(({ password, portalPassword, ...u }) => ({
    ...u,
    hasPassword: Boolean(password),
    hasPortalPassword: Boolean(portalPassword),
  }));

  const tickets = await prisma.ticket.findMany({
    include: { user: true, replies: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });

  const chats = await prisma.liveChat.findMany({
    include: { messages: true },
    orderBy: { createdAt: 'desc' }
  });

  const settings = await prisma.systemSettings.findFirst() || await prisma.systemSettings.create({data:{id:'1'}});

  return <AdminClient users={users} tickets={tickets} chats={chats} settings={settings} />;
}

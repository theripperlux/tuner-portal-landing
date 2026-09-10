import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
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
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.email !== 'info@deepxclusive.com' && session.user.email !== 'info@tunerportal.com')) {
    redirect({ href: '/login', locale });
    return null;
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

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

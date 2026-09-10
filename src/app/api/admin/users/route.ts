import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== 'ADMIN' && session.user.email !== 'info@deepxclusive.com' && session.user.email !== 'info@tunerportal.com')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // A user owns Tickets (which own TicketReplies) and TuningJobs.
    // Those foreign keys have no ON DELETE CASCADE, so we must remove
    // the children before the user — all in one transaction so a
    // partial failure rolls back. Deleting a Ticket cascades to its
    // replies automatically (TicketReply.ticket is onDelete: Cascade).
    await prisma.$transaction([
      prisma.ticket.deleteMany({ where: { userId: id } }),
      prisma.tuningJob.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

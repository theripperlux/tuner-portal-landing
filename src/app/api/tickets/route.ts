import { NextResponse } from "next/server";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const context = await getServerAuthContext();
    if (context === "REQUIRE_TENANT_SELECTION") {
      return NextResponse.json({ error: "Tenant selection required" }, { status: 403 });
    }
    if (!context || context.membershipStatus !== "active") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        message,
        userId: context.userId,
        tenantId: context.tenantId
      }
    });

    const user = await prisma.user.findUnique({ where: { id: context.userId } });

    // Notify Daniel per request
    await sendAdminNotification(
      `Neues Support-Ticket: ${subject}`,
      `Der Benutzer ${user?.name || user?.email} hat ein neues Ticket eröffnet:\n\nBetreff: ${subject}\nNachricht: ${message}`
    );

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Ticket creation failed", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const context = await getServerAuthContext();
    if (context === "REQUIRE_TENANT_SELECTION") {
      return NextResponse.json({ error: "Tenant selection required" }, { status: 403 });
    }
    if (!context || context.membershipStatus !== "active") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, message } = await req.json();
    if (!ticketId || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const reply = await prisma.ticketReply.create({
      data: {
        ticketId,
        message,
        tenantId: context.tenantId,
        authorMembershipId: context.membershipId
      }
    });

    if (!context.roles.includes('admin') && !context.roles.includes('owner')) {
      const user = await prisma.user.findUnique({ where: { id: context.userId } });
      await sendAdminNotification(`Neue Ticket-Antwort`, `Der Benutzer ${user?.email} hat auf ein Ticket geantwortet:\n\nNachricht: ${message}`);
    }

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Ticket reply failed", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const context = await getServerAuthContext();
    if (context === "REQUIRE_TENANT_SELECTION") {
      return NextResponse.json({ error: "Tenant selection required" }, { status: 403 });
    }
    if (!context || (!context.roles.includes('admin') && !context.roles.includes('owner'))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, status } = await req.json();
    if (!ticketId || !status) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Ticket status update failed", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

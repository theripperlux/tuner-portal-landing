import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPlatformAdminUser } from "@/lib/auth/platformAdmin";

export async function POST(req: Request) {
  try {
    const { chatId, message } = await req.json();
    if (!chatId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // The "admin reply" identity must never come from client input — a
    // visitor could otherwise mark their own message isAdmin:true and
    // spoof an official Tunerportal reply in the same thread. Only a
    // verified platform admin (re-checked against the DB) may post as one.
    const adminUser = await getPlatformAdminUser();

    const chatMsg = await prisma.liveMessage.create({
      data: { chatId, message, isAdmin: Boolean(adminUser) }
    });
    return NextResponse.json(chatMsg);
  } catch (err) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

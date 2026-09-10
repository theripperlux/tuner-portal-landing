import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { chatId, message, isAdmin } = await req.json();
    const chatMsg = await prisma.liveMessage.create({
      data: { chatId, message, isAdmin: isAdmin || false }
    });
    return NextResponse.json(chatMsg);
  } catch (err) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    const chat = await prisma.liveChat.create({
      data: { name, email, phone }
    });
    return NextResponse.json({ id: chat.id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to start chat" }, { status: 500 });
  }
}

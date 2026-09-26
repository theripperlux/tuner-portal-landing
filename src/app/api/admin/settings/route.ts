import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPlatformAdminUser } from "@/lib/auth/platformAdmin";

export async function POST(req: Request) {
  try {
    const adminUser = await getPlatformAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure } = await req.json();

    const data = {
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      ...(typeof smtpSecure === 'boolean' ? { smtpSecure } : {}),
    };

    const settings = await prisma.systemSettings.upsert({
      where: { id: '1' },
      update: data,
      create: { id: '1', ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

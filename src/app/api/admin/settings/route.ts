import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role?.toLowerCase();
    const email = session?.user?.email;
    const isAuthorized = role === "admin" || role === "owner" || email === "info@tunerportal.com" || email === "info@deepxclusive.com";

    if (!session || !isAuthorized) {
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

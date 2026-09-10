import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyName, phone, adminDomain, customerDomain } = await req.json();

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    
    // Auto-generate a password if not exists and domains are set
    let newPassword = currentUser?.portalPassword;
    if (!newPassword && (adminDomain || customerDomain)) {
       newPassword = Math.random().toString(36).slice(-10) + "!";
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        companyName,
        ...(phone !== undefined ? { phone } : {}),
        adminDomain,
        customerDomain,
        ...(newPassword && !currentUser?.portalPassword ? { portalPassword: newPassword } : {})
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("User settings update failed", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

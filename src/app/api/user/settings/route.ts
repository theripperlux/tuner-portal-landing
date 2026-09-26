import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
       // Cryptographically random, not Math.random() (predictable PRNG).
       newPassword = crypto.randomBytes(12).toString("base64url") + "!";
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

    // Never return the password hash — everything else here (including
    // the user's own portalPassword, which they legitimately need to see
    // once) is fine for the owning user to receive.
    const { password, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("User settings update failed", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

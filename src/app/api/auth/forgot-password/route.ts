import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCustomerEmail } from "@/lib/mailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback_secret";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, an email was sent." });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    // Using the current domain or localhost
    const appUrl = process.env.NEXTAUTH_URL || "https://tunerportal.com";
    const resetLink = `${appUrl}/de/reset-password?token=${token}`;

    const emailText = `Hallo ${user.firstName || user.name || ''},\n\nDu hast ein neues Passwort für das Tunerportal angefordert. Klicke auf den folgenden Link, um dein Passwort zurückzusetzen (dieser Link ist 1 Stunde gültig):\n\n${resetLink}\n\nFalls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.`;

    const result = await sendCustomerEmail(user.email as string, "Tunerportal Passwort zurücksetzen", emailText);

    if (!result.ok) {
      console.error("Failed to send reset email:", result.error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ message: "If an account exists, an email was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendAdminNotification } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, companyName, firstName, lastName, phone, address, zip, country, euVat } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || null;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        firstName,
        lastName,
        phone,
        companyName,
        address,
        zip,
        country,
        euVat
      }
    });

    // Notify Daniel per request
    await sendAdminNotification(
      "Neue Benutzerregistrierung auf Tunerportal",
      `Ein neuer Benutzer hat sich registriert:\n\nName: ${fullName}\nFirma: ${companyName || 'Keine Angabe'}\nEmail: ${email}\nEuVat: ${euVat || 'Keine'}`
    );

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}

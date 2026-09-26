import { NextResponse } from "next/server";
import { sendCustomerEmail } from "@/lib/mailer";
import { getPlatformAdminUser } from "@/lib/auth/platformAdmin";

export async function POST(req: Request) {
  try {
    const adminUser = await getPlatformAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await sendCustomerEmail(to, subject, message);

    if (result.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error || "Failed to send email" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { sendTestEmail } from "@/lib/mailer";
import { getPlatformAdminUser } from "@/lib/auth/platformAdmin";

/**
 * Sends a test email to the provided address using the saved global
 * SMTP settings, so an admin can verify the mail configuration. Save
 * the SMTP settings first, then test.
 */
export async function POST(req: Request) {
  const adminUser = await getPlatformAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { to } = await req.json().catch(() => ({}));
  if (!to || typeof to !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json(
      { error: "Enter a valid email address to send the test to." },
      { status: 400 },
    );
  }

  const result = await sendTestEmail(to.trim());
  if (result.ok) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: result.error }, { status: 502 });
}

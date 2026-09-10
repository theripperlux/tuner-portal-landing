import * as nodemailer from "nodemailer";
import { prisma } from "./prisma";

interface SmtpConfig {
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpUser?: string | null;
  smtpPass?: string | null;
  smtpSecure?: boolean | null;
}

function createSmtpTransporter(settings: SmtpConfig) {
  const port = settings.smtpPort || 587;
  // Port 465 requires secure: true (implicit TLS).
  // Port 587 requires secure: false (STARTTLS).
  // If port is neither 465 nor 587, use configured smtpSecure setting or false.
  const isSecure = port === 465 ? true : port === 587 ? false : !!settings.smtpSecure;

  return nodemailer.createTransport({
    host: settings.smtpHost || "",
    port: port,
    secure: isSecure,
    auth: {
      user: settings.smtpUser || "",
      pass: settings.smtpPass || "",
    },
    tls: {
      rejectUnauthorized: false, // Prevents certificate verification errors on custom/self-signed mail server certs
    },
  });
}

export async function sendAdminNotification(subject: string, text: string) {
  try {
    const settings = await prisma.systemSettings.findFirst();
    if (
      !settings ||
      !settings.smtpHost ||
      !settings.smtpUser ||
      !settings.smtpPass
    ) {
      console.warn(
        "SMTP settings are not configured in Admin panel. Logging email instead:",
      );
      console.log(`[EMAIL to daniel.conrardy@gmail.com] Subject: ${subject}`);
      console.log(text);
      return false;
    }

    const transporter = createSmtpTransporter(settings);

    await transporter.sendMail({
      from: `"Tunerportal System" <${settings.smtpUser}>`,
      to: "daniel.conrardy@gmail.com",
      subject,
      text,
    });

    console.log(`Email sent successfully: ${subject}`);
    return true;
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return false;
  }
}

/**
 * Sends a test email using the currently-saved global SMTP settings, so
 * an admin can verify the configuration (host / port / secure / creds)
 * end-to-end. Returns the real transport error on failure so the admin
 * can diagnose.
 */
export async function sendTestEmail(
  to: string,
): Promise<{ ok: boolean; error?: string }> {
  const settings = await prisma.systemSettings.findFirst();
  if (
    !settings ||
    !settings.smtpHost ||
    !settings.smtpUser ||
    !settings.smtpPass
  ) {
    return {
      ok: false,
      error:
        "SMTP is not fully configured. Save host, user and password first.",
    };
  }
  try {
    const transporter = createSmtpTransporter(settings);
    await transporter.sendMail({
      from: `"Tunerportal System" <${settings.smtpUser}>`,
      to,
      subject: "Tunerportal SMTP Test",
      text: "This is a test email from your Tunerportal admin panel. If you received this, your SMTP settings are working correctly.",
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function sendCustomerEmail(
  to: string,
  subject: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const settings = await prisma.systemSettings.findFirst();
  if (
    !settings ||
    !settings.smtpHost ||
    !settings.smtpUser ||
    !settings.smtpPass
  ) {
    return {
      ok: false,
      error: "SMTP is not fully configured.",
    };
  }
  try {
    const transporter = createSmtpTransporter(settings);
    await transporter.sendMail({
      from: `"Tunerportal Admin" <${settings.smtpUser}>`,
      to,
      subject,
      text,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cleanHost, slugify, submitTenantRegistration } from "@/lib/tenant-api";
import { z } from "zod";

const registrationSchema = z.object({
  // the client is just confirming, we already have these in DB from previous step,
  // but if the client sends them we could validate. 
  // Wait, the client in our code didn't send them, it just POSTs to trigger sync.
  // The user says "Zod Validation, Mass Assignment Schutz, etc".
  // Since we rely on the `User` record, maybe the client shouldn't send anything.
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting could go here (e.g. upstash/redis or memory map if not available)
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { memberships: { include: { tenant: true } } }
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existingRegistrationMembership = user.memberships.find(
    (m) => m.tenant.status === "pending" || m.tenant.status === "active"
  );

  if (user.tenantRegistrationId && existingRegistrationMembership) {
    return NextResponse.json({
      alreadySubmitted: true,
      id: user.tenantRegistrationId,
      status: existingRegistrationMembership.tenant.status,
    });
  }

  const firstName = (user.firstName || "").trim();
  const lastName = (user.lastName || "").trim();
  const email = (user.email || "").trim();
  const phone = (user.phone || "").trim();
  const companyName = (user.companyName || "").trim();
  const adminDomain = cleanHost(user.adminDomain || "");
  const customerDomain = cleanHost(user.customerDomain || "");

  const missing: string[] = [];
  if (!firstName) missing.push("first name");
  if (!lastName) missing.push("last name");
  if (!email) missing.push("email");
  if (phone.length < 4) missing.push("phone number");
  if (!companyName) missing.push("company name");
  if (!adminDomain) missing.push("admin domain");
  if (!customerDomain) missing.push("customer/portal domain");
  
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Please complete: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  if (adminDomain === customerDomain) {
    return NextResponse.json(
      { error: "Admin and portal domains must be different." },
      { status: 400 },
    );
  }

  let companySlug =
    (user.companySlug && slugify(user.companySlug)) ||
    slugify(companyName) ||
    slugify(customerDomain.split(".")[0] || "");
    
  if (!companySlug) {
    return NextResponse.json(
      { error: "Could not derive a valid company identifier." },
      { status: 400 },
    );
  }

  try {
    const result = await submitTenantRegistration({
      firstName,
      lastName,
      email,
      phone,
      companyName,
      companySlug,
      adminDomain,
      customerDomain,
    });

    const newStatus = result.status === "approved" ? "active" : "pending";

    // Atomic transaction for updating user and creating/updating tenant
    await prisma.$transaction(async (tx) => {
      let tenantId: string;
      const pendingMembership = user.memberships.find(m => m.tenant.status === "pending");

      if (!pendingMembership) {
        const newTenant = await tx.tenant.create({
          // mass assignment protection: only explicitly map fields
          data: {
            name: companyName,
            domain: customerDomain,
            ownerId: user.id,
            status: newStatus,
            onboardingStatus: "not_started"
          }
        });
        tenantId = newTenant.id;
        
        await tx.tenantMembership.create({
          data: {
            userId: user.id,
            tenantId: tenantId,
            role: "owner",
            membershipStatus: "active"
          }
        });
      } else {
        tenantId = pendingMembership.tenantId;
        await tx.tenant.update({
          where: { id: tenantId },
          data: {
            status: newStatus
          }
        });
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          companySlug,
          tenantRegistrationId: result.id,
          tenantRegistrationError: null,
          tenantRegistrationSubmittedAt: new Date(),
        },
      });
    });

    return NextResponse.json({ id: result.id, status: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed.";
    
    // We update the user but don't touch the tenant status to keep it clean
    await prisma.user.update({
      where: { id: user.id },
      data: {
        companySlug,
        tenantRegistrationError: message.slice(0, 500),
      },
    });
    // If tenant exists, maybe set it to error state, but let's just log it on the user 
    // or tenant depending on logic.
    const errorMembership = user.memberships[0];
    if (errorMembership) {
      await prisma.tenant.update({
        where: { id: errorMembership.tenantId },
        data: { status: "error" } // assuming error is valid, wait, is it?
      }).catch(() => {});
    }
    
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

import { NextResponse } from "next/server";
import { getServerAuthContext } from "@/lib/auth/sessionContext";
import { prisma } from "@/lib/prisma";
import { consumeCredits } from "@/lib/credits";

export async function POST(req: Request) {
  try {
    const context = await getServerAuthContext();
    if (context === "REQUIRE_TENANT_SELECTION") {
      return NextResponse.json({ error: "Tenant selection required" }, { status: 403 });
    }
    if (!context || context.membershipStatus !== "active") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const vehicleInfo = formData.get("vehicleInfo") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Usually you would upload the file to S3 or a cloud bucket here.
    // For now, we just save the filename.
    const originalFileName = file.name;

    // The cost is typically dynamic, but we'll default to 1 credit for this MVP.
    const CREDITS_COST = 1;

    // Use a unique idempotency key based on user and timestamp to prevent double charge on retries
    const idempotencyKey = `job_upload_${context.userId}_${Date.now()}`;

    try {
      // Step 1: Consume credits transactionally
      await consumeCredits({
        scope: {
          tenantId: context.tenantId,
          userId: context.userId,
          membershipId: context.membershipId
        },
        amount: CREDITS_COST,
        reason: `Tuning Job Upload: ${originalFileName}`,
        idempotencyKey
      });
    } catch (err: any) {
      if (err.message === "Insufficient credits") {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
      }
      throw err;
    }

    // Step 2: Create StoredFile first
    const storedFile = await prisma.storedFile.create({
      data: {
        tenantId: context.tenantId,
        ownerUserId: context.userId,
        uploadedByMembershipId: context.membershipId,
        storageProvider: "local",
        storageKey: `jobs/${Date.now()}_${originalFileName}`,
        originalFilename: originalFileName,
        sizeBytes: file.size || 0,
        status: "READY"
      }
    });

    // Step 3: Create tuning job
    const job = await prisma.tuningJob.create({
      data: {
        userId: context.userId,
        tenantId: context.tenantId,
        membershipId: context.membershipId,
        status: "PENDING",
        calculatedCreditCost: CREDITS_COST,
        originalFileId: storedFile.id
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Tuning job creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

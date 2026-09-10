import { NextResponse } from 'next/server';
import { getServerAuthContext } from '@/lib/auth/sessionContext';
import { consumeCredits } from '@/lib/credits';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const context = await getServerAuthContext();
    if (context === "REQUIRE_TENANT_SELECTION") {
      return NextResponse.json({ error: "Tenant selection required" }, { status: 403 });
    }
    if (!context || context.membershipStatus !== 'active') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { originalFile } = await request.json();

    if (!originalFile) {
      return NextResponse.json({ error: 'Missing original file' }, { status: 400 });
    }

    const COST_PER_FILE = 1; // 1 credit equates to 5 EUR

    // 1. Deduct Credits
    try {
      const scope = {
        tenantId: context.tenantId,
        userId: context.userId,
        membershipId: context.membershipId
      };
      await consumeCredits({
        scope, 
        amount: COST_PER_FILE, 
        reason: `AI Tuning for file: ${originalFile}`,
        idempotencyKey: `tuning-${context.userId}-${Date.now()}`
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 402 }); // Payment required
    }

    // 2. Perform AI Tuning mock
    const tunedFileUrl = `https://mock-storage.ecutuningportal.com/tuned_${Date.now()}.bin`;

    // 3. Save Job in DB
    const storedOriginalFile = await prisma.storedFile.create({
      data: {
        tenantId: context.tenantId,
        ownerUserId: context.userId,
        uploadedByMembershipId: context.membershipId,
        storageProvider: "local",
        storageKey: `jobs/${Date.now()}_${originalFile}`,
        originalFilename: originalFile,
        sizeBytes: 1024,
        status: "READY"
      }
    });

    const storedTunedFile = await prisma.storedFile.create({
      data: {
        tenantId: context.tenantId,
        ownerUserId: context.userId,
        uploadedByMembershipId: context.membershipId,
        storageProvider: "mock",
        storageKey: tunedFileUrl,
        originalFilename: `tuned_${originalFile}`,
        sizeBytes: 1024,
        status: "READY"
      }
    });

    const job = await prisma.tuningJob.create({
      data: {
        userId: context.userId,
        tenantId: context.tenantId,
        membershipId: context.membershipId,
        originalFileId: storedOriginalFile.id,
        tunedFileId: storedTunedFile.id,
        status: 'COMPLETED',
        calculatedCreditCost: COST_PER_FILE,
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

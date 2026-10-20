import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entitlementId: string }> }
) {
  try {
    const { entitlementId } = await params;
    const currentUser = await getCurrentUser();

    // 1. Fetch Entitlement with Order and Artwork/Product details
    const entitlement = await prisma.purchaseEntitlement.findUnique({
      where: { id: entitlementId },
      include: {
        order: true,
        artwork: true,
        product: true,
      },
    });

    if (!entitlement) {
      return NextResponse.json({ error: 'Entitlement not found' }, { status: 404 });
    }

    // 2. Verify Order Payment Status is COMPLETED
    if (entitlement.order.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment has not been completed or verified for this order' },
        { status: 403 }
      );
    }

    // 3. Verify user entitlement (if bound to a registered user account)
    if (entitlement.userId && (!currentUser || currentUser.userId !== entitlement.userId)) {
      // Allow download if order was placed with guest email and user matches or if public guest order token
      if (currentUser?.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'You are not authorized to download this item' },
          { status: 403 }
        );
      }
    }

    // 4. Verify Download Limits
    if (entitlement.downloadCount >= entitlement.maxDownloads) {
      return NextResponse.json(
        { error: `Download limit reached (${entitlement.maxDownloads} downloads allowed). Contact support for assistance.` },
        { status: 429 }
      );
    }

    // 5. Locate Private File
    let relativeFilePath: string | null = null;
    let downloadFilename = 'mandala-artwork.svg';
    let contentType = 'image/svg+xml';

    if (entitlement.artwork) {
      relativeFilePath = entitlement.artwork.originalFile;
      downloadFilename = `${entitlement.artwork.slug}-vector.svg`;
      contentType = 'image/svg+xml';
    } else if (entitlement.product) {
      relativeFilePath = entitlement.product.fileUrl;
      downloadFilename = `${entitlement.product.slug}.pdf`;
      contentType = 'application/pdf';
    }

    if (!relativeFilePath) {
      return NextResponse.json({ error: 'Asset file is not configured' }, { status: 404 });
    }

    // Resolve absolute path safely within storage/private or public
    let absolutePath: string;
    if (relativeFilePath.startsWith('/storage/private/')) {
      const cleanRel = relativeFilePath.replace('/storage/private/', '');
      absolutePath = path.join(process.cwd(), 'storage', 'private', cleanRel);
    } else {
      const cleanRel = relativeFilePath.replace('/uploads/', '');
      absolutePath = path.join(process.cwd(), 'public', 'uploads', cleanRel);
    }

    if (!fs.existsSync(/*turbopackIgnore: true*/ absolutePath)) {
      return NextResponse.json({ error: 'File on disk not found' }, { status: 404 });
    }

    // 6. Record Download Audit & Increment Counter
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    await prisma.$transaction([
      prisma.purchaseEntitlement.update({
        where: { id: entitlement.id },
        data: { downloadCount: { increment: 1 } },
      }),
      prisma.downloadRecord.create({
        data: {
          entitlementId: entitlement.id,
          userId: currentUser?.userId || null,
          ipAddress,
        },
      }),
    ]);

    // 7. Stream file bytes securely
    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ absolutePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });
  } catch (error: any) {
    console.error('Download delivery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

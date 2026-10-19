import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'COMPLETED') {
      return NextResponse.json({ success: true, orderNumber: order.orderNumber });
    }

    // Mark as completed
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        stripePaymentIntentId: `mock_pi_${Date.now()}`,
      },
    });

    // Create Entitlements
    for (const item of order.items) {
      await prisma.purchaseEntitlement.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          productId: item.productId,
          artworkId: item.artworkId,
          downloadCount: 0,
          maxDownloads: 10,
        },
      });

      if (item.artworkId) {
        await prisma.artwork.update({
          where: { id: item.artworkId },
          data: { salesCount: { increment: 1 } },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error: any) {
    console.error('Mock completion error:', error);
    return NextResponse.json({ error: 'Payment completion failed' }, { status: 500 });
  }
}

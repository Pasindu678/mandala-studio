import Stripe from 'stripe';
import { prisma } from '@/lib/db/prisma';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const isStripeConfigured = stripeSecretKey.startsWith('sk_live_') || stripeSecretKey.startsWith('sk_test_');

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    })
  : null;

export interface VerifiedItem {
  type: 'artwork' | 'product';
  id: string;
  title: string;
  price: number;
  originalFile?: string | null;
  fileUrl?: string | null;
  license: string;
}

export interface RecalculatedCart {
  items: VerifiedItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  discountCodeApplied?: string | null;
}

/**
 * STRICT SERVER-SIDE PRICE RECALCULATION
 * Never trust prices passed from client!
 */
export async function recalculateCart(
  rawItems: { type: 'artwork' | 'product'; id: string }[],
  discountCodeStr?: string
): Promise<RecalculatedCart> {
  const verifiedItems: VerifiedItem[] = [];

  for (const item of rawItems) {
    if (item.type === 'artwork') {
      const art = await prisma.artwork.findUnique({
        where: { id: item.id, isPublished: true, isArchived: false },
        select: { id: true, title: true, price: true, isFree: true, originalFile: true, license: true },
      });
      if (art) {
        verifiedItems.push({
          type: 'artwork',
          id: art.id,
          title: art.title,
          price: art.isFree ? 0.0 : art.price,
          originalFile: art.originalFile,
          license: art.license,
        });
      }
    } else if (item.type === 'product') {
      const prod = await prisma.product.findUnique({
        where: { id: item.id, isPublished: true },
        select: { id: true, title: true, price: true, fileUrl: true, license: true },
      });
      if (prod) {
        verifiedItems.push({
          type: 'product',
          id: prod.id,
          title: prod.title,
          price: prod.price,
          fileUrl: prod.fileUrl,
          license: prod.license,
        });
      }
    }
  }

  const subtotal = verifiedItems.reduce((acc, it) => acc + it.price, 0);
  let discountAmount = 0.0;
  let discountCodeApplied: string | null = null;

  if (discountCodeStr && subtotal > 0) {
    const code = await prisma.discountCode.findUnique({
      where: { code: discountCodeStr.toUpperCase().trim() },
    });

    if (code && code.isActive) {
      const minOrder = code.minOrderAmount || 0;
      if (subtotal >= minOrder) {
        if (code.percentage) {
          discountAmount = (subtotal * code.percentage) / 100;
        } else if (code.fixedAmount) {
          discountAmount = Math.min(code.fixedAmount, subtotal);
        }
        discountCodeApplied = code.code;
      }
    }
  }

  const total = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));

  return {
    items: verifiedItems,
    subtotal: Number(subtotal.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    total,
    discountCodeApplied,
  };
}

/**
 * Creates an order record and fulfills entitlements upon verified payment
 */
export async function fulfillOrder({
  orderNumber,
  userId,
  customerEmail,
  customerName,
  recalculated,
  stripeSessionId,
  stripePaymentIntentId,
}: {
  orderNumber: string;
  userId?: string | null;
  customerEmail: string;
  customerName: string;
  recalculated: RecalculatedCart;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
}) {
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      customerEmail,
      customerName,
      subtotal: recalculated.subtotal,
      discountAmount: recalculated.discountAmount,
      totalAmount: recalculated.total,
      currency: 'USD',
      status: 'COMPLETED',
      stripeSessionId,
      stripePaymentIntentId,
      items: {
        create: recalculated.items.map((item) => ({
          productId: item.type === 'product' ? item.id : null,
          artworkId: item.type === 'artwork' ? item.id : null,
          title: item.title,
          price: item.price,
          licenseType: item.license,
        })),
      },
    },
  });

  // Create PurchaseEntitlements for each item
  for (const item of recalculated.items) {
    await prisma.purchaseEntitlement.create({
      data: {
        userId: userId || null,
        orderId: order.id,
        productId: item.type === 'product' ? item.id : null,
        artworkId: item.type === 'artwork' ? item.id : null,
        downloadCount: 0,
        maxDownloads: 10,
      },
    });

    // Increment sales count if artwork
    if (item.type === 'artwork') {
      await prisma.artwork.update({
        where: { id: item.id },
        data: { salesCount: { increment: 1 } },
      }).catch(() => {});
    }
  }

  // If discount code was used, increment usage count
  if (recalculated.discountCodeApplied) {
    await prisma.discountCode.update({
      where: { code: recalculated.discountCodeApplied },
      data: { usesCount: { increment: 1 } },
    }).catch(() => {});
  }

  return order;
}

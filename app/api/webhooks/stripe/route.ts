import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 501 });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe webhook secret or signature' }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const orderNumber = session.metadata?.orderNumber;

      if (orderNumber) {
        const order = await prisma.order.findUnique({
          where: { orderNumber },
          include: { items: true },
        });

        if (order && order.status !== 'COMPLETED') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: 'COMPLETED',
              stripePaymentIntentId: session.payment_intent as string,
            },
          });

          // Create entitlements
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
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook verification error:', error.message);
    return NextResponse.json({ error: `Webhook error: ${error.message}` }, { status: 400 });
  }
}

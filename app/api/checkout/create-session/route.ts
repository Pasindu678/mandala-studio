import { NextRequest, NextResponse } from 'next/server';
import { CheckoutPayloadSchema } from '@/lib/validation/schemas';
import { recalculateCart, fulfillOrder, stripe } from '@/lib/payments/stripe';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid checkout payload' },
        { status: 400 }
      );
    }

    const { customerName, customerEmail, items, discountCode } = parsed.data;
    const currentUser = await getCurrentUser();

    // 1. STRICT SERVER-SIDE RECALCULATION
    const recalculated = await recalculateCart(items, discountCode);

    if (recalculated.items.length === 0) {
      return NextResponse.json({ error: 'No valid items found in cart' }, { status: 400 });
    }

    // Generate unique order number: MS-YYYY-RANDOM
    const orderNumber = `MS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 2. IF TOTAL IS 0.00 (All Free or 100% discount) -> INSTANT FULFILLMENT
    if (recalculated.total <= 0.0) {
      const order = await fulfillOrder({
        orderNumber,
        userId: currentUser?.userId,
        customerEmail,
        customerName,
        recalculated,
      });

      return NextResponse.json({
        success: true,
        isFreeOrder: true,
        orderNumber: order.orderNumber,
        redirectUrl: `/checkout/success?orderNumber=${order.orderNumber}`,
      });
    }

    // 3. IF STRIPE IS CONFIGURED WITH VALID SECRET KEY
    const paymentMode = process.env.NEXT_PUBLIC_PAYMENT_MODE || 'mock';
    if (stripe && paymentMode === 'stripe') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      const lineItems = recalculated.items.map((it) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: it.title,
            description: `${it.license} License • High-Resolution Vector & Print PDF`,
          },
          unit_amount: Math.round(it.price * 100),
        },
        quantity: 1,
      }));

      // Create pre-order in pending status
      const pendingOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId: currentUser?.userId,
          customerEmail,
          customerName,
          subtotal: recalculated.subtotal,
          discountAmount: recalculated.discountAmount,
          totalAmount: recalculated.total,
          currency: 'USD',
          status: 'PENDING',
          items: {
            create: recalculated.items.map((it) => ({
              productId: it.type === 'product' ? it.id : null,
              artworkId: it.type === 'artwork' ? it.id : null,
              title: it.title,
              price: it.price,
              licenseType: it.license,
            })),
          },
        },
      });

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        customer_email: customerEmail,
        client_reference_id: pendingOrder.id,
        metadata: {
          orderNumber,
          userId: currentUser?.userId || '',
        },
        success_url: `${appUrl}/checkout/success?orderNumber=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/cart`,
      });

      await prisma.order.update({
        where: { id: pendingOrder.id },
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({
        success: true,
        mode: 'stripe',
        url: session.url,
      });
    }

    // 4. SANDBOX / MOCK TEST PAYMENT MODE
    // Creates a pending order ready for sandbox simulator payment
    const pendingOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: currentUser?.userId,
        customerEmail,
        customerName,
        subtotal: recalculated.subtotal,
        discountAmount: recalculated.discountAmount,
        totalAmount: recalculated.total,
        currency: 'USD',
        status: 'PENDING',
        items: {
          create: recalculated.items.map((it) => ({
            productId: it.type === 'product' ? it.id : null,
            artworkId: it.type === 'artwork' ? it.id : null,
            title: it.title,
            price: it.price,
            licenseType: it.license,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      mode: 'mock',
      orderNumber: pendingOrder.orderNumber,
      orderId: pendingOrder.id,
      total: recalculated.total,
    });
  } catch (error: any) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { recalculateCart } from '@/lib/payments/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const discountCode = typeof body.discountCode === 'string' ? body.discountCode : undefined;

    const result = await recalculateCart(rawItems, discountCode);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cart recalculation error:', error);
    return NextResponse.json({ error: 'Failed to recalculate cart' }, { status: 500 });
  }
}

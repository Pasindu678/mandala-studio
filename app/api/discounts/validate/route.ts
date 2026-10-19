import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const codeStr = String(body.code || '').toUpperCase().trim();
    const cartSubtotal = Number(body.cartSubtotal) || 0;

    if (!codeStr) {
      return NextResponse.json({ valid: false, error: 'Discount code is required' }, { status: 400 });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: codeStr },
    });

    if (!discount || !discount.isActive) {
      return NextResponse.json({ valid: false, error: 'Invalid or inactive discount code' }, { status: 404 });
    }

    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'This discount code has expired' }, { status: 400 });
    }

    if (discount.maxUses && discount.usesCount >= discount.maxUses) {
      return NextResponse.json({ valid: false, error: 'This discount code has reached its usage limit' }, { status: 400 });
    }

    if (discount.minOrderAmount && cartSubtotal < discount.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Requires a minimum order of $${discount.minOrderAmount.toFixed(2)}`,
      }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: discount.code,
      percentage: discount.percentage,
      fixedAmount: discount.fixedAmount,
      minOrderAmount: discount.minOrderAmount,
    });
  } catch (error: any) {
    console.error('Discount validation error:', error);
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 });
  }
}

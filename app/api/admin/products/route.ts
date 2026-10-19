import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { ProductSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        artworks: { include: { artwork: true } },
        _count: { select: { orderItems: true } },
      },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const parsed = ProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid product data' },
        { status: 400 }
      );
    }

    const { artworkIds, ...data } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${data.slug}" already exists.` }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        artworks: {
          create: artworkIds?.map((artId) => ({ artworkId: artId })) || [],
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'CREATE_PRODUCT',
        entityType: 'Product',
        entityId: product.id,
        details: JSON.stringify({ title: product.title, price: product.price }),
      },
    });

    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { id, artworkIds, ...data } = body;

    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const parsed = ProductSchema.partial().safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid product data' },
        { status: 400 }
      );
    }

    if (parsed.data.slug) {
      const existing = await prisma.product.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json({ error: `Slug "${parsed.data.slug}" already taken.` }, { status: 409 });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    if (artworkIds && Array.isArray(artworkIds)) {
      await prisma.productArtwork.deleteMany({ where: { productId: id } });
      for (const artId of artworkIds) {
        await prisma.productArtwork.create({
          data: { productId: id, artworkId: artId },
        });
      }
    }

    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const ordersCount = await prisma.orderItem.count({ where: { productId: id } });
    if (ordersCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete product: It is associated with ${ordersCount} completed orders. Please unpublish it instead.` },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}

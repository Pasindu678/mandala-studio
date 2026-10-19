import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { ArtworkSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (status === 'archived') where.isArchived = true;
    if (status === 'published') {
      where.isPublished = true;
      where.isArchived = false;
    }
    if (status === 'draft') {
      where.isPublished = false;
      where.isArchived = false;
    }

    const artworks = await prisma.artwork.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        _count: {
          select: { orderItems: true },
        },
      },
    });

    return NextResponse.json(artworks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();

    // Convert tags array to string if needed
    if (Array.isArray(body.tags)) {
      body.tags = JSON.stringify(body.tags);
    }

    const parsed = ArtworkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid artwork data' },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      description,
      categoryId,
      tags,
      difficulty,
      previewImage,
      originalFile,
      isFree,
      price,
      license,
      isPublished,
      displayOrder,
    } = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.artwork.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `The URL slug "${slug}" is already in use by another artwork.` },
        { status: 409 }
      );
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags),
        difficulty,
        previewImage,
        originalFile,
        isFree,
        price: isFree ? 0.0 : price,
        license,
        isPublished,
        displayOrder,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'CREATE_ARTWORK',
        entityType: 'Artwork',
        entityId: artwork.id,
        details: JSON.stringify({ title, slug, price }),
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath(`/artwork/${artwork.slug}`);

    return NextResponse.json({ success: true, artwork });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create artwork' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 });
    }

    if (Array.isArray(data.tags)) {
      data.tags = JSON.stringify(data.tags);
    }

    const parsed = ArtworkSchema.partial().safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid artwork data' },
        { status: 400 }
      );
    }

    if (parsed.data.slug) {
      const existing = await prisma.artwork.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: `The URL slug "${parsed.data.slug}" is already taken.` },
          { status: 409 }
        );
      }
    }

    const updateData: any = { ...parsed.data };
    if (updateData.isFree === true) {
      updateData.price = 0.0;
    }

    const updated = await prisma.artwork.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'UPDATE_ARTWORK',
        entityType: 'Artwork',
        entityId: updated.id,
        details: JSON.stringify(updateData),
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath(`/artwork/${updated.slug}`);

    return NextResponse.json({ success: true, artwork: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update artwork' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 });
    }

    // Safety check: Does artwork have purchase history / customer orders?
    const orderItemsCount = await prisma.orderItem.count({
      where: { artworkId: id },
    });

    if (orderItemsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot permanently delete: This artwork has ${orderItemsCount} customer purchase records. To preserve customer entitlement and order records, please use the "Archive" action instead.`,
        },
        { status: 400 }
      );
    }

    await prisma.artwork.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'DELETE_ARTWORK',
        entityType: 'Artwork',
        entityId: id,
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete artwork' }, { status: 500 });
  }
}

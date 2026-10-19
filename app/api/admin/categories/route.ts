import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { CategorySchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { artworks: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const parsed = CategorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid category data' },
        { status: 400 }
      );
    }

    const { name, slug, description, coverImage, displayOrder, isFeatured, isPublished } = parsed.data;

    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `The URL slug "${slug}" is already in use by another category. Please choose a unique slug.` },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        coverImage: coverImage || `/uploads/categories/${slug}.svg`,
        displayOrder,
        isFeatured,
        isPublished,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'CREATE_CATEGORY',
        entityType: 'Category',
        entityId: category.id,
        details: JSON.stringify({ name, slug }),
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const parsed = CategorySchema.partial().safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid category data' },
        { status: 400 }
      );
    }

    // Check slug collision if slug changed
    if (parsed.data.slug) {
      const existing = await prisma.category.findFirst({
        where: { slug: parsed.data.slug, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: `The URL slug "${parsed.data.slug}" is already taken.` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'UPDATE_CATEGORY',
        entityType: 'Category',
        entityId: updated.id,
        details: JSON.stringify(parsed.data),
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath(`/categories/${updated.slug}`);

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Check linked artworks
    const artworksCount = await prisma.artwork.count({
      where: { categoryId: id },
    });

    if (artworksCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: It contains ${artworksCount} artworks. Please reassign or delete the artworks first, or unpublish the category instead.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'DELETE_CATEGORY',
        entityType: 'Category',
        entityId: id,
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 });
  }
}

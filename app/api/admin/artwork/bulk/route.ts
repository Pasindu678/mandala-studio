import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { BulkArtworkSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const parsed = BulkArtworkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid bulk upload items' },
        { status: 400 }
      );
    }

    const { items } = parsed.data;
    const createdArtworks = [];

    for (const item of items) {
      // Ensure unique slug
      let uniqueSlug = item.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const existing = await prisma.artwork.findUnique({
        where: { slug: uniqueSlug },
      });
      if (existing) {
        uniqueSlug = `${uniqueSlug}-${Date.now().toString().slice(-4)}`;
      }

      const created = await prisma.artwork.create({
        data: {
          title: item.title,
          slug: uniqueSlug,
          categoryId: item.categoryId,
          difficulty: item.difficulty,
          previewImage: item.previewImage,
          originalFile: item.originalFile,
          isFree: item.isFree,
          price: item.isFree ? 0.0 : item.price,
          license: item.license,
          isPublished: item.isPublished,
          tags: JSON.stringify(['mandala', item.difficulty.toLowerCase()]),
        },
      });

      createdArtworks.push(created);
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'BULK_UPLOAD_ARTWORK',
        entityType: 'Artwork',
        details: JSON.stringify({ count: createdArtworks.length }),
      },
    });

    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({
      success: true,
      count: createdArtworks.length,
      artworks: createdArtworks,
    });
  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: error.message || 'Bulk upload failed' }, { status: 500 });
  }
}

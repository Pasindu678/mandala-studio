import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { CollectionSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const collections = await prisma.collection.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        artworks: {
          include: { artwork: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    return NextResponse.json(collections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const parsed = CollectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid collection data' },
        { status: 400 }
      );
    }

    const { artworkIds, ...data } = parsed.data;

    const existing = await prisma.collection.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: `Slug "${data.slug}" already exists.` }, { status: 409 });
    }

    const collection = await prisma.collection.create({
      data: {
        ...data,
        artworks: {
          create: artworkIds?.map((artId, idx) => ({
            artworkId: artId,
            displayOrder: idx,
          })) || [],
        },
      },
    });

    revalidatePath('/');
    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create collection' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { id, artworkIds, ...data } = body;

    if (!id) return NextResponse.json({ error: 'Collection ID required' }, { status: 400 });

    const updated = await prisma.collection.update({
      where: { id },
      data,
    });

    if (artworkIds && Array.isArray(artworkIds)) {
      await prisma.collectionArtwork.deleteMany({ where: { collectionId: id } });
      for (let i = 0; i < artworkIds.length; i++) {
        await prisma.collectionArtwork.create({
          data: {
            collectionId: id,
            artworkId: artworkIds[i],
            displayOrder: i,
          },
        });
      }
    }

    revalidatePath('/');
    return NextResponse.json({ success: true, collection: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Collection ID required' }, { status: 400 });

    await prisma.collection.delete({ where: { id } });
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete collection' }, { status: 500 });
  }
}

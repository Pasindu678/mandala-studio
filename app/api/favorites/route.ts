import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ favorites: [] });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: currentUser.userId },
    select: { artworkId: true },
  });

  return NextResponse.json({
    favorites: favorites.map((f) => f.artworkId),
  });
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { artworkId } = await req.json();
    if (!artworkId) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 });
    }

    await prisma.favorite.upsert({
      where: {
        userId_artworkId: {
          userId: currentUser.userId,
          artworkId,
        },
      },
      create: {
        userId: currentUser.userId,
        artworkId,
      },
      update: {},
    });

    await prisma.artwork.update({
      where: { id: artworkId },
      data: { favoritesCount: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { artworkId } = await req.json();
    if (!artworkId) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: currentUser.userId,
        artworkId,
      },
    });

    await prisma.artwork.update({
      where: { id: artworkId },
      data: { favoritesCount: { decrement: 1 } },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}

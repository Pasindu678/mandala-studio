import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { saveUploadedFile } from '@/lib/storage';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const media = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(media);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const subfolder = (formData.get('subfolder') as string) || 'artworks';
    const isPrivate = formData.get('isPrivate') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await saveUploadedFile({
      buffer,
      originalName: file.name,
      mimeType: file.type || 'image/svg+xml',
      isPrivate,
      subfolder,
    });

    return NextResponse.json({
      success: true,
      file: result,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media Asset ID is required' }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Try deleting file from disk
    const filename = path.basename(asset.path);
    const targetFolder = asset.isPrivate
      ? path.join(process.cwd(), 'storage', 'private', 'artworks')
      : path.join(process.cwd(), 'public', 'uploads', 'artworks');
    const absolutePath = path.join(targetFolder, filename);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch {
        // ignore disk error
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete asset' }, { status: 500 });
  }
}

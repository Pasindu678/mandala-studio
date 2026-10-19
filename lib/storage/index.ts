import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/db/prisma';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
export const ALLOWED_DOC_TYPES = ['application/pdf'];
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export interface SaveUploadedFileOptions {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  isPrivate?: boolean;
  subfolder?: string; // e.g. 'artworks', 'categories', 'products'
}

export interface StoredFileResult {
  filename: string;
  originalName: string;
  path: string; // URL path or absolute path
  mimeType: string;
  sizeBytes: number;
  isPrivate: boolean;
  mediaAssetId: string;
}

export async function saveUploadedFile({
  buffer,
  originalName,
  mimeType,
  isPrivate = false,
  subfolder = 'artworks',
}: SaveUploadedFileOptions): Promise<StoredFileResult> {
  // Validate size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum allowed size of 25MB`);
  }

  // Validate type
  const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
  if (!allowed.includes(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType}. Allowed types: JPG, PNG, WebP, SVG, PDF.`);
  }

  // Generate safe filename
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e4)}`;
  const filename = `${baseName}-${uniqueSuffix}${ext}`;

  let targetDir: string;
  let publicUrlOrPrivatePath: string;

  if (isPrivate) {
    targetDir = path.join(process.cwd(), 'storage', 'private', subfolder);
    publicUrlOrPrivatePath = `/storage/private/${subfolder}/${filename}`;
  } else {
    targetDir = path.join(process.cwd(), 'public', 'uploads', subfolder);
    publicUrlOrPrivatePath = `/uploads/${subfolder}/${filename}`;
  }

  // Ensure directory exists
  fs.mkdirSync(targetDir, { recursive: true });

  const destination = path.join(targetDir, filename);
  fs.writeFileSync(destination, buffer);

  // Create MediaAsset record
  const mediaAsset = await prisma.mediaAsset.create({
    data: {
      filename,
      originalName,
      mimeType,
      sizeBytes: buffer.length,
      path: publicUrlOrPrivatePath,
      isPrivate,
      usageCount: 1,
    },
  });

  return {
    filename,
    originalName,
    path: publicUrlOrPrivatePath,
    mimeType,
    sizeBytes: buffer.length,
    isPrivate,
    mediaAssetId: mediaAsset.id,
  };
}

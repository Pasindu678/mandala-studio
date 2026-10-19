import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const contents = await prisma.websiteContent.findMany();
    const mapped: Record<string, any> = {};
    for (const c of contents) {
      try {
        mapped[c.key] = JSON.parse(c.content);
      } catch {
        mapped[c.key] = c.content;
      }
    }
    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { key, section, content } = body;

    if (!key || !section || content === undefined) {
      return NextResponse.json({ error: 'Key, section, and content are required' }, { status: 400 });
    }

    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

    const saved = await prisma.websiteContent.upsert({
      where: { key },
      create: {
        key,
        section,
        content: contentStr,
      },
      update: {
        section,
        content: contentStr,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: 'UPDATE_WEBSITE_CONTENT',
        entityType: 'WebsiteContent',
        entityId: saved.id,
        details: JSON.stringify({ key, section }),
      },
    });

    // Revalidate public routes immediately!
    revalidatePath('/');
    revalidatePath('/gallery');

    return NextResponse.json({ success: true, saved });
  } catch (error: any) {
    console.error('Homepage content update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
  }
}

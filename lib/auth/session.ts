import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';
import { prisma } from '@/lib/db/prisma';

export const AUTH_COOKIE_NAME = 'mandala_session';

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value || 
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(req?: NextRequest): Promise<TokenPayload> {
  let user: TokenPayload | null = null;
  if (req) {
    user = getUserFromRequest(req);
  }
  if (!user) {
    user = await getCurrentUser();
  }
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin(req?: NextRequest): Promise<TokenPayload> {
  const user = await requireAuth(req);
  if (user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}

export async function getFullUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          favorites: true,
          entitlements: true,
        }
      }
    }
  });
}

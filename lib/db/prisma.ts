import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // 1. If it's a remote PostgreSQL / MySQL URL, use directly
  if (envUrl && (envUrl.startsWith('postgresql:') || envUrl.startsWith('postgres:') || envUrl.startsWith('mysql:'))) {
    return envUrl;
  }

  // 2. Candidate source locations for the bundled SQLite dev.db
  const candidatePaths = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.resolve('./prisma/dev.db'),
    path.join(process.env.LAMBDA_TASK_ROOT || '/var/task', 'prisma', 'dev.db'),
    path.join(process.env.LAMBDA_TASK_ROOT || '/var/task', '.next', 'server', 'prisma', 'dev.db'),
    path.join(__dirname, 'prisma', 'dev.db'),
    path.join(__dirname, '..', 'prisma', 'dev.db'),
    path.join(__dirname, '../..', 'prisma', 'dev.db'),
    path.join(__dirname, '../../..', 'prisma', 'dev.db'),
    path.join(__dirname, '../../../../prisma', 'dev.db'),
  ];

  let foundSource: string | null = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
      foundSource = p;
      break;
    }
  }

  // Check if we are running in a serverless environment (Netlify, AWS Lambda, Vercel)
  const isServerless = Boolean(
    process.env.NETLIFY || 
    process.env.AWS_LAMBDA_FUNCTION_NAME || 
    process.env.LAMBDA_TASK_ROOT || 
    process.env.VERCEL
  );

  // In AWS Lambda / Netlify functions runtime, the filesystem is strictly read-only except /tmp
  if (isServerless && process.platform !== 'win32') {
    const tmpDbPath = path.join('/tmp', 'mandala_dev.db');
    
    // Copy to /tmp if it doesn't already exist
    if (foundSource) {
      try {
        if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
          fs.copyFileSync(foundSource, tmpDbPath);
          try {
            fs.chmodSync(tmpDbPath, 0o666);
          } catch {}
        }
        return `file:${tmpDbPath}`;
      } catch (err) {
        console.error('Error preparing writable database in /tmp:', err);
      }
    } else if (fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // Standard environment: use foundSource or default
  if (foundSource) {
    return `file:${foundSource}`;
  }

  return `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;

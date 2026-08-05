export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

// Tests: env vars, DB connection, file write ability
export async function GET(_req: NextRequest) {
  const results: Record<string, unknown> = {};

  // 1. Check env vars
  results.DATABASE_URL_set = !!process.env.DATABASE_URL;
  results.NODE_ENV = process.env.NODE_ENV;

  // 2. Check uploads dir is writable
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    const testFile = path.join(uploadDir, '_test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    results.uploads_dir_writable = true;
  } catch (e) {
    results.uploads_dir_writable = false;
    results.uploads_error = String(e);
  }

  // 3. Check DB connection
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const count = await prisma.productImage.count();
    results.db_connected = true;
    results.product_images_count = count;
    await prisma.$disconnect();
  } catch (e) {
    results.db_connected = false;
    results.db_error = String(e);
  }

  // 4. List upload files
  try {
    const files = fs.readdirSync(uploadDir).filter(f => f !== '.gitkeep');
    results.upload_files = files;
  } catch (e) {
    results.upload_files_error = String(e);
  }

  return NextResponse.json(results);
}

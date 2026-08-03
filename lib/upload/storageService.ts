import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  const uuid = crypto.randomUUID();
  return `${uuid}${ext}`;
}

async function storeLocally(file: File): Promise<string> {
  const filename = generateFilename(file.name);
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

async function storeOnCloudinary(file: File): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'divine-bytes';

  // Params must be sorted alphabetically for correct signature
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  // Convert file to buffer and send as multipart
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = new Blob([buffer], { type: file.type || 'image/jpeg' });

  const formData = new FormData();
  formData.append('file', blob, file.name);
  formData.append('folder', folder);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', apiKey);
  formData.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const data = (await response.json()) as { secure_url: string };
  return data.secure_url;
}

/**
 * Uses Cloudinary when credentials are present, local disk otherwise.
 */
export async function uploadFile(file: File): Promise<string> {
  const hasCloudinary =
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinary) {
    return storeOnCloudinary(file);
  }
  return storeLocally(file);
}

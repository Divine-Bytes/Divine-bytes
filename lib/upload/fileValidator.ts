/**
 * File upload validator.
 * Validates MIME type via magic bytes, file extension, and file size.
 */

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Allowed MIME types for image uploads */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/** Magic byte signatures for allowed image types */
const MAGIC_BYTES: Array<{ mime: string; bytes: number[]; offset: number }> = [
  // JPEG: FF D8 FF
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff], offset: 0 },
  // PNG: 89 50 4E 47
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47], offset: 0 },
  // WebP: RIFF....WEBP
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
  // GIF87a or GIF89a
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  detectedMime?: string;
}

/**
 * Detects the MIME type of a file buffer by reading magic bytes.
 * Returns null if the type is unrecognised.
 */
export function detectMimeType(buffer: Uint8Array): string | null {
  for (const sig of MAGIC_BYTES) {
    const slice = buffer.slice(sig.offset, sig.offset + sig.bytes.length);
    if (sig.bytes.every((b, i) => slice[i] === b)) {
      // For WebP, additionally check bytes 8-11 for "WEBP"
      if (sig.mime === 'image/webp') {
        const webpMarker = buffer.slice(8, 12);
        const isWebP =
          webpMarker[0] === 0x57 &&
          webpMarker[1] === 0x45 &&
          webpMarker[2] === 0x42 &&
          webpMarker[3] === 0x50;
        if (!isWebP) continue;
      }
      return sig.mime;
    }
  }
  return null;
}

/**
 * Validates an uploaded file for type and size.
 */
export async function validateFile(file: File): Promise<ValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size must not exceed 5 MB.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }

  // Read first 12 bytes for magic byte detection
  const arrayBuffer = await file.slice(0, 12).arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const detectedMime = detectMimeType(buffer);

  if (!detectedMime) {
    return {
      valid: false,
      error: 'Only image files are accepted.',
    };
  }

  if (!ALLOWED_MIME_TYPES.has(detectedMime)) {
    return {
      valid: false,
      error: 'Only image files are accepted.',
      detectedMime,
    };
  }

  return { valid: true, detectedMime };
}

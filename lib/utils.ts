/**
 * Merges class names — drop-in for clsx/twMerge.
 * Filters out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a number as PKR currency.
 */
export function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates text to a given length, appending '...' if truncated.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

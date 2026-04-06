/** Escape HTML special characters to prevent XSS in emails */
export function esc(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Normalize email: trim whitespace and lowercase */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
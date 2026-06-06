/**
 * Recursively sanitizes strings in an object to remove common mojibake/encoding artifacts.
 */
export function sanitizeData<T>(data: T): T {
  if (typeof data === 'string') {
    // Replace common mojibake characters
    // Ã‚Â (Â ) is the ISO-8859-1 decoding of the UTF-8 non-breaking space (0xC2 0xA0)
    // â€“ is an en-dash
    // â€” is an em-dash
    // â€™ is a right single quote / apostrophe
    // â€œ and â€ are left and right double quotes
    return data
      .replace(/Ã‚Â/g, ' ')
      .replace(/â€“/g, '–')
      .replace(/â€”/g, '—')
      .replace(/â€™/g, "'")
      .replace(/â€œ/g, '"')
      .replace(/â€/g, '"')
      // Also clean up stray Â characters
      .replace(/Â/g, ' ')
      .trim() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)) as unknown as T;
  }

  if (typeof data === 'object' && data !== null) {
    const sanitizedObj: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitizedObj[key] = sanitizeData(value);
    }
    return sanitizedObj as T;
  }

  return data;
}

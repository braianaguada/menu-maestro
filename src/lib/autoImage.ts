const sourceBase = 'https://source.unsplash.com/featured/';

export function buildAutoImageUrl(query: string) {
  const sanitized = query.trim().toLowerCase();
  const keywords = sanitized ? sanitized.replace(/\s+/g, ',') : 'food';
  return `${sourceBase}?${encodeURIComponent(keywords)}&w=1200&h=900&fit=crop`;
}

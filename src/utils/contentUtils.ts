import { UniversalContent } from '@/types/content';

export function isContentPublic(content: UniversalContent, now: Date = new Date()): boolean {
  if (content.status === 'draft' || content.status === 'archived' || content.status === 'review') {
    return false;
  }
  
  if (content.status === 'scheduled') {
    if (!content.publishedAt) return false;
    const pubDate = new Date(content.publishedAt);
    if (pubDate > now) return false;
  }
  
  return true;
}

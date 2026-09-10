import { UniversalContent, ContentType } from '@/types/content';

export interface ContentRepository {
  getContentById(id: string): Promise<UniversalContent | null>;
  getContentBySlug(type: ContentType, slug: string, locale: string): Promise<UniversalContent | null>;
  getAllContent(type: ContentType, locale?: string): Promise<UniversalContent[]>;
  getPublishedContent(type: ContentType, locale?: string): Promise<UniversalContent[]>;
  getTranslations(translationGroupId: string): Promise<UniversalContent[]>;
  getRelatedContent(targetIds: string[]): Promise<UniversalContent[]>;
}

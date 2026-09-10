import { contentRepository } from './LocalContentAdapter';
import { UniversalContent, ContentType } from '@/types/content';

export async function getContentBySlug(type: ContentType, slug: string, locale: string): Promise<UniversalContent | null> {
  return contentRepository.getContentBySlug(type, slug, locale);
}

export async function getAllContent(type: ContentType, locale?: string): Promise<UniversalContent[]> {
  return contentRepository.getAllContent(type, locale);
}

export async function getPublishedContent(type: ContentType, locale?: string): Promise<UniversalContent[]> {
  return contentRepository.getPublishedContent(type, locale);
}

export async function getTranslations(translationGroupId: string): Promise<UniversalContent[]> {
  return contentRepository.getTranslations(translationGroupId);
}

export async function getRelatedContentByIds(ids: string[]): Promise<UniversalContent[]> {
  return contentRepository.getRelatedContent(ids);
}

import { ContentRepository } from './ContentRepository';
import { UniversalContent, ContentType } from '@/types/content';
import { featuresData } from '@/data/features';
import { solutionsData } from '@/data/solutions';
import { validateContentDatabase } from '../validation/contentValidator';
import { isContentPublic } from '@/utils/contentUtils';

class LocalContentAdapter implements ContentRepository {
  private allData: UniversalContent[];

  constructor() {
    this.allData = [...featuresData, ...solutionsData];
    
    // Validate on startup/build
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
      validateContentDatabase(this.allData);
    }
  }

  async getContentById(id: string): Promise<UniversalContent | null> {
    const item = this.allData.find(c => c.id === id);
    return item ? (item as UniversalContent) : null;
  }

  async getContentBySlug(type: ContentType, slug: string, locale: string): Promise<UniversalContent | null> {
    const item = this.allData.find(c => c.type === type && c.slug === slug && c.locale === locale);
    return item ? (item as UniversalContent) : null;
  }

  async getAllContent(type: ContentType, locale?: string): Promise<UniversalContent[]> {
    let items = this.allData.filter(c => c.type === type);
    if (locale) {
      items = items.filter(c => c.locale === locale);
    }
    return items as UniversalContent[];
  }

  async getPublishedContent(type: ContentType, locale?: string): Promise<UniversalContent[]> {
    const items = await this.getAllContent(type, locale);
    return items.filter(c => isContentPublic(c));
  }

  async getTranslations(translationGroupId: string): Promise<UniversalContent[]> {
    return this.allData.filter(c => c.translationGroupId === translationGroupId) as UniversalContent[];
  }

  async getRelatedContent(targetIds: string[]): Promise<UniversalContent[]> {
    return this.allData.filter(c => targetIds.includes(c.id)) as UniversalContent[];
  }
}

// Export a singleton instance of the repository
export const contentRepository: ContentRepository = new LocalContentAdapter();

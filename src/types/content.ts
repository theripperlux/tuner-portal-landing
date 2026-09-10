import { ContentModule } from './modules';

export type ContentType = 
  | 'feature' 
  | 'solution' 
  | 'integration' 
  | 'comparison' 
  | 'industry' 
  | 'tutorial' 
  | 'glossary' 
  | 'blog' 
  | 'case_study' 
  | 'documentation' 
  | 'api_documentation' 
  | 'academy' 
  | 'knowledge_base' 
  | 'template' 
  | 'changelog' 
  | 'landing_page' 
  | 'legal_page';

export type TranslationGroupId = string;
export type SchemaType = 'SoftwareApplication' | 'Article' | 'FAQPage' | 'Product' | 'WebPage' | 'TechArticle' | 'HowTo' | 'Review' | 'VideoObject' | 'BreadcrumbList' | 'Organization';

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalOverride?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaTypes: SchemaType[];
  structuredDataOverrides?: Record<string, any>;
  searchIntent: 'informational' | 'transactional' | 'commercial' | 'navigational';
  difficulty?: number;
  priority?: number;
}

export interface AiMetadata {
  aiSummary?: string;
  aiQuestions?: string[];
  aiAnswers?: string[];
  vectorId?: string;
  embeddingStatus?: 'pending' | 'completed' | 'failed';
  embeddingModel?: string;
  embeddedAt?: string;
  llmMetadata?: Record<string, any>;
}

export interface ContentRelation {
  targetId: string; // The ID of the related content
  relationType: 'related' | 'recommended' | 'parent' | 'child' | 'supports' | 'integrates_with' | 'alternative_to' | 'mentioned_in';
  weight?: number;
  manual?: boolean;
}

export interface BaseContent {
  id: string; // Globally Unique ID
  type: ContentType;
  slug: string; // Unique within type + locale
  locale: string;
  translationGroupId: TranslationGroupId;
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  authorId?: string;
  version: number;
  
  parentId?: string;
  order?: number;
  tags: string[];
  categories: string[];
  featuredImage?: string;
  noIndex: boolean;
  excludeFromSitemap: boolean;
  
  title: string;
  
  // Modules
  seo: SeoMetadata;
  ai: AiMetadata;
  relations: ContentRelation[];
}

// Payload Types
export interface FeaturePayload {
  modules: ContentModule[];
}

export interface SolutionPayload {
  modules: ContentModule[];
}

// Discriminated Union
export type UniversalContent = 
  | (BaseContent & { type: 'feature'; payload: FeaturePayload })
  | (BaseContent & { type: 'solution'; payload: SolutionPayload })
  | (BaseContent & { type: 'integration'; payload: any }); // Placeholder until implemented

import { universalContentSchema } from './contentSchema';
import { UniversalContent } from '@/types/content';

export function validateContentDatabase(allContent: UniversalContent[]) {
  const errors: string[] = [];
  const idSet = new Set<string>();
  const slugSet = new Set<string>(); // type + locale + slug

  allContent.forEach((content) => {
    // 1. Zod Validation
    const result = universalContentSchema.safeParse(content);
    if (!result.success) {
      errors.push(`Validation failed for ID: ${content.id}. Errors: ${result.error.message}`);
    }

    // 2. ID Uniqueness
    if (idSet.has(content.id)) {
      errors.push(`Duplicate ID found: ${content.id}`);
    }
    idSet.add(content.id);

    // 3. Slug Uniqueness (type + locale + slug)
    const slugKey = `${content.type}-${content.locale}-${content.slug}`;
    if (slugSet.has(slugKey)) {
      errors.push(`Duplicate Slug Combination found: ${slugKey}`);
    }
    slugSet.add(slugKey);
    
    // 4. Missing Content in Published State
    if (content.status === 'published' && (!content.payload || Object.keys(content.payload).length === 0)) {
       errors.push(`Published content ${content.id} is missing payload/modules.`);
    }
  });

  // 5. Dead Link Validation
  allContent.forEach((content) => {
    content.relations.forEach((relation) => {
      if (!idSet.has(relation.targetId)) {
        errors.push(`Dead link found in ${content.id}: relation targetId ${relation.targetId} does not exist.`);
      }
    });
  });

  // 6. Translation Group Consistency
  const translationGroups: Record<string, UniversalContent[]> = {};
  allContent.forEach(content => {
    if (!translationGroups[content.translationGroupId]) {
      translationGroups[content.translationGroupId] = [];
    }
    translationGroups[content.translationGroupId].push(content);
  });

  Object.entries(translationGroups).forEach(([groupId, items]) => {
    if (items.length < 2) {
      errors.push(`Translation group missing or incomplete for groupId: ${groupId}`);
    }
    const types = new Set(items.map(i => i.type));
    if (types.size > 1) {
      errors.push(`Inconsistent types in translation group ${groupId}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Content Database Validation Failed:\n${errors.join('\n')}`);
  }
  
  return true;
}

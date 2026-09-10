import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Typ für die Frontmatter Metadaten
export interface MdxFrontmatter {
  title: string;
  description: string;
  date?: string;
  category?: string;
  image?: string;
  canonicalUrl?: string;
  author?: string;
  // Fallback für alle anderen Custom-Fields
  [key: string]: any;
}

export interface MdxContent {
  slug: string;
  frontmatter: MdxFrontmatter;
  content: string;
}

// Der Basis-Pfad ist src/content
const contentDirectory = path.join(process.cwd(), 'src', 'content');

/**
 * Liest alle Slugs eines bestimmten Typs und einer Sprache (z.B. type='blog', locale='de')
 */
export function getAllMdxSlugs(type: string, locale: string): string[] {
  const directory = path.join(contentDirectory, locale, type);
  
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);
  // Nur .mdx Dateien
  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => fileName.replace(/\.mdx$/, ''));
}

/**
 * Holt den Inhalt einer spezifischen MDX Datei
 */
export function getMdxContent(type: string, locale: string, slug: string): MdxContent | null {
  let fullPath = path.join(contentDirectory, locale, type, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    // Fallback to default 'de' language
    fullPath = path.join(contentDirectory, 'de', type, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Parsen von Frontmatter und Content mit gray-matter
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as MdxFrontmatter,
    content,
  };
}

/**
 * Holt alle Inhalte eines Typs (hilfreich für Blog-Übersichten)
 */
export function getAllMdxContent(type: string, locale: string): MdxContent[] {
  const slugs = getAllMdxSlugs(type, locale);
  
  const allContent = slugs.map(slug => getMdxContent(type, locale, slug))
    .filter((c): c is MdxContent => c !== null);

  // Optional: Nach Datum sortieren, falls es ein Datum gibt
  return allContent.sort((a, b) => {
    if (a.frontmatter.date && b.frontmatter.date) {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    }
    return 0;
  });
}

import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogsDir = path.join(process.cwd(), '_blogs');

export interface Blog {
  author: {
    name: string;
    social: string;
  };
  date: Date;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
}

export const getBlogFromSlug = (slug: string): Blog => {
  const fullPath = path.join(blogsDir, `${slug}.md`);
  const file = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(file);
  return {
    ...data,
    date: new Date(data.date),
    content,
    slug,
  } as Blog;
};

export const getAllBlogs = (): Blog[] => {
  const rawMdFiles = fs.readdirSync(blogsDir);
  const slugs = rawMdFiles.map((file) => file.replace(/\.md$/, ''));
  return slugs.map(getBlogFromSlug);
};

export const markdownToHtml = async (markdown: string): Promise<string> => {
  const htmlResult = await remark().use(html).process(markdown);
  return htmlResult.toString();
};

import { getAllBlogs } from '@/lib/blogs/api';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();
  const blogUrls = blogs.map((blog) => ({
    url: `https://free-invoices.org/blogs/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://free-invoices.org',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://free-invoices.org/help',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://free-invoices.org/blogs',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogUrls,
  ];
}

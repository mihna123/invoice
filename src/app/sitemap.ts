import { getAllBlogs } from '@/lib/blogs/api';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();
  const blogUrls = blogs.map((blog) => ({
    url: `https://www.free-invoices.org/blogs/${blog.slug}`,
    lastModified: blog.date,
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://www.free-invoices.org',
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.free-invoices.org/help',
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.free-invoices.org/blogs',
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogUrls,
  ];
}

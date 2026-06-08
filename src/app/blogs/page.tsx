import { type Blog, getAllBlogs } from '@/lib/blogs/api';
import Link from 'next/link';

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className="space-y-2">
      <Link
        href={`/blogs/${blog.slug}`}
        className="link text-3xl font-semibold"
      >
        {blog.title}
      </Link>
      <p>
        by {blog.author.name} ~ {blog.date.toLocaleDateString()}
      </p>
      <p className="text-lg">{blog.excerpt}</p>
      <Link href={`/blogs/${blog.slug}`} className="link">
        READ MORE &gt;
      </Link>
    </div>
  );
};

export default function BlogPage() {
  const blogs = getAllBlogs();
  // newest first
  blogs.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <section className="mt-10 flex justify-center">
      <div className="w-5xl space-y-4">
        <h1 className="text-4xl font-bold">Free Invoice Generator Blogs</h1>
        {blogs.map((b) => (
          <BlogCard key={b.slug} blog={b} />
        ))}
      </div>
    </section>
  );
}

import { getBlogFromSlug, markdownToHtml } from '@/lib/blogs/api';

type Params = {
  params: Promise<{ slug: string }>;
};

export default async function Blog(props: Params) {
  const params = await props.params;
  const blog = getBlogFromSlug(params.slug);
  const htmlContent = await markdownToHtml(blog.content);

  return (
    <section className="mt-10 flex justify-center">
      <div className="w-5xl space-y-4">
        <h1 className="m-0 mb-2 text-4xl font-bold">{blog.title}</h1>
        <p>
          by{' '}
          <a
            href={blog.author.social}
            target="_blank"
            rel="noopener noreferrerer"
            className="link"
          >
            {blog.author.name}
          </a>{' '}
          ~ {blog.date.toLocaleDateString()}
        </p>
        <p className="mb-10 text-lg">{blog.excerpt}</p>
        <article
          className="markdown"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
}

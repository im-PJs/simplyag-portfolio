import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import { client } from '@/lib/sanity';
import Link from 'next/link';

// 1) Fetch a single post by slug
async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    publishedAt,
    "imageUrl": image.asset->url,
    body,
    bodyHtml
  }`;
  return client.fetch(query, { slug });
}

// 2) Page metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const description = post.bodyHtml
    ? post.bodyHtml.replace(/<[^>]+>/g, "").slice(0, 150)
    : Array.isArray(post.body) &&
      post.body[0]?.children?.[0]?.text
      ? post.body[0].children[0].text.slice(0, 150)
      : "";

  return {
    title: `${post.title} | SimplyAG`,
    description,
  };
}

// 3) The actual page
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#0b1120] text-white overflow-hidden pt-28 pb-20 px-6 animate-fadeInSlow">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">

        {/* Back link */}
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 self-start"
        >
          ← Back to Blog
        </Link>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white leading-tight drop-shadow-xl">
          {post.title}
        </h1>

        {/* Date */}
        <p className="text-center text-gray-400 text-sm mt-2">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-cover transition-transform hover:scale-105 duration-500 ease-in-out animate-fadeIn"
            />
          </div>
        )}

        {/* Body */}
        <div className="prose prose-invert max-w-none">
          {post.bodyHtml ? (
            <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          ) : (
            <PortableText
              value={post.body}
              components={{
                marks: {
                  link: ({ value, children }) => (
                    <a
                      href={value.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] underline hover:opacity-80 transition-colors duration-200"
                    >
                      {children}
                    </a>
                  ),
                },
                block: {
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-semibold text-white mt-8 mb-3">{children}</h3>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-4">{children}</p>
                  ),
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0b1120] to-transparent pointer-events-none" />
    </section>
  );
}

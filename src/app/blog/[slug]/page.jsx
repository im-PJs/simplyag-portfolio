// src/app/blog/[slug]/page.jsx
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity'

// 1) Fetch a single post by slug
async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    publishedAt,
    "imageUrl": image.asset->url,
    body
  }`
  return client.fetch(query, { slug })
}

// 2) Page metadata
export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const description = Array.isArray(post.body) &&
    post.body[0]?.children?.[0]?.text
      ? post.body[0].children[0].text.slice(0, 150)
      : ''

  return {
    title: `${post.title} | SimplyAG`,
    description,
  }
}

// 3) The actual page
export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <section className="bg-gray-900 py-20">
      <div className="max-w-5xl mx-auto px-6 text-white">
        {/* Back link */}
        <a
          href="/blog"
          className="block mb-10 text-center text-sm text-gray-400 hover:text-gold"
        >
          ← Back to Blog
        </a>

        {/* Title */}
        <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-gold leading-tight">
          {post.title}
        </h1>

        {/* Date */}
        <p className="mb-8 text-center text-sm text-gray-400">
          {new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Featured image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="mb-12 w-full rounded-xl shadow-lg object-cover"
          />
        )}

        {/* Body with Tailwind Typography */}
        <article className="prose prose-invert prose-lg max-w-none leading-relaxed text-gray-200">
          <PortableText value={post.body} />
        </article>
      </div>
    </section>
  )
}

// src/app/blog/page.jsx

import Link from "next/link";
import { client } from "@/lib/sanity";

export const revalidate = 30; // optional, revalidate every 30s

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{
  _id, title, slug, publishedAt
}`;

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <main className="container mx-auto min-h-screen max-w-4xl p-8">
      <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
      <p className="text-gray-300 mb-12 max-w-2xl">
        Trip reports, life updates, behind-the-scenes moments, and more. Just us, living it.
      </p>

      {posts.length > 0 ? (
        <div className="grid gap-8">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="block bg-gray-800 rounded-lg p-6 hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p>No blog posts yet! Stay tuned 👀</p>
      )}
    </main>
  );
}

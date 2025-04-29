// src/app/blog/page.jsx

import { client } from "@/lib/sanity";
import BlogCard from "@/components/BlogCard";
import BlogHeroBackground from "@/components/BlogHeroBackground";

export const revalidate = 30;

// ✅ Filter out drafts with this clause: !(_id in path("drafts.**"))
const POSTS_QUERY = `
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
    | order(publishedAt desc)[0...12] {
      _id,
      title,
      slug,
      publishedAt,
      image {
        asset->{
          _id,
          url
        }
      }
    }
`;

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BlogHeroBackground />

      {/* Faded Section Background */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 pt-36 pb-20">
        <div className="bg-black/60 backdrop-blur-lg rounded-lg p-10">

          {/* Title */}
          <h1 className="text-6xl font-extrabold text-white text-center mb-6 drop-shadow-lg relative inline-block after:block after:h-1 after:bg-[#D4AF37] after:w-20 after:mx-auto after:mt-6">
            Blog
          </h1>

          {/* Subtitle */}
          <p className="text-white text-lg text-center mb-14 opacity-80">
            Our latest adventures, stories, and theme park memories.
          </p>

          {/* Blog Cards */}
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-center text-white text-lg">
                No blog posts yet! Stay tuned 👀
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Fade Divider */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-0" />
    </div>
  );
}

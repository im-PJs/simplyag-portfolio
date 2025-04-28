// src/components/BlogCard.jsx

import Link from "next/link";
import Image from "next/image";

export default function BlogCard({ post }) {
  const hasImage = post.image?.asset?.url !== undefined;
  const imageUrl = hasImage
    ? post.image.asset.url
    : "/images/fallback.jpg"; // fallback if missing

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block bg-white/80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 backdrop-blur-md border border-white/10"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-500 ease-out"
          priority
          placeholder="blur"
          blurDataURL="/images/fallback.jpg"
        />
      </div>

      <div className="p-6 bg-white/80">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}

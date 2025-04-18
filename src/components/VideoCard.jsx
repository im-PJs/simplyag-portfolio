// src/components/VideoCard.jsx
export default function VideoCard({ title, thumbnail, url, publishedAt, seconds }) {
    // 1) Format the publish date
    const date = new Date(publishedAt).toLocaleDateString(undefined, {
      year:   "numeric",
      month:  "short",
      day:    "numeric",
    });
  
    // 2) Build a duration string without “:00” at the end:
    let dur;
    if (seconds >= 3600) {
      // hour‑long videos → H:MM
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      dur = `${h}:${String(m).padStart(2, "0")}`;
    } else {
      // under an hour → M:SS
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      dur = `${m}:${String(s).padStart(2, "0")}`;
    }
  
    return (
      <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover"
          />
  
          {/* Duration badge (bottom‑right) */}
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-mono px-1 rounded">
            {dur}
          </span>
  
          {/* Title & date */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white leading-tight">
              {title}
            </h3>
            <p className="mt-1 text-gray-400 text-sm">{date}</p>
          </div>
        </a>
      </div>
    );
  }
  
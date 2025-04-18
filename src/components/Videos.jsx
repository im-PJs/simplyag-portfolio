// src/components/Videos.jsx
import VideoCard from "./VideoCard"

// 1) Pull your key & channel ID from env
const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

if (!API_KEY) {
  throw new Error("Missing YouTube API key; set YOUTUBE_API_KEY in .env.local")
}
if (!CHANNEL_ID) {
  throw new Error("Missing channel ID; set YOUTUBE_CHANNEL_ID in .env.local")
}

// 2) Helper: get the “uploads” playlist for your channel
async function getUploadsPlaylistId() {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels")
  url.searchParams.set("part", "contentDetails")
  url.searchParams.set("id", CHANNEL_ID)
  url.searchParams.set("key", API_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YT channels ${res.status}`)
  const data = await res.json()
  const items = data.items || []
  if (!items[0]) throw new Error("Channel not found or no contentDetails")
  return items[0].contentDetails.relatedPlaylists.uploads
}

// 3) Helper: fetch a page of playlist items
async function fetchPlaylistItems(playlistId, pageToken = "") {
  const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems")
  url.searchParams.set("part", "contentDetails")
  url.searchParams.set("playlistId", playlistId)
  url.searchParams.set("maxResults", "50")
  url.searchParams.set("key", API_KEY)
  if (pageToken) url.searchParams.set("pageToken", pageToken)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YT playlistItems ${res.status}`)
  return res.json()
}

// 4) Helper: fetch video snippet + duration
async function fetchVideoDetails(ids) {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos")
  url.searchParams.set("part", "snippet,contentDetails")
  url.searchParams.set("id", ids.join(","))
  url.searchParams.set("key", API_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`YT videos ${res.status}`)
  return res.json()
}

// 5) Helper: parse ISO8601 duration to seconds
function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  const [, h = 0, min = 0, s = 0] = m.slice(1).map(Number)
  return h * 3600 + min * 60 + s
}

// 6) The Videos component
export default async function Videos() {
  // A) resolve uploads playlist
  let uploadsPlaylist
  try {
    uploadsPlaylist = await getUploadsPlaylistId()
  } catch (e) {
    console.error(e)
    return (
      <section id="videos" className="py-16 bg-gray-900">
        <p className="text-center text-red-400">
          Failed to load videos: {e.message}
        </p>
      </section>
    )
  }

  // B) page through every item
  let allVideoIds = []
  let nextToken = ""
  do {
    const page = await fetchPlaylistItems(uploadsPlaylist, nextToken)
    page.items.forEach((i) => allVideoIds.push(i.contentDetails.videoId))
    nextToken = page.nextPageToken || ""
  } while (nextToken)

  // C) dedupe
  allVideoIds = Array.from(new Set(allVideoIds))

  // D) batch‑fetch full details
  let videosData = []
  for (let i = 0; i < allVideoIds.length; i += 50) {
    const batch = allVideoIds.slice(i, i + 50)
    const details = await fetchVideoDetails(batch)
    videosData.push(...details.items)
  }

  // E) map, filter out shorts, sort newest‑first
  const withMeta = videosData.map((v) => ({
    id: v.id,
    title: v.snippet.title,
    thumbnail: v.snippet.thumbnails.high.url,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    publishedAt: v.snippet.publishedAt,
    seconds: parseDuration(v.contentDetails.duration),
  }))
  const filtered = withMeta
    .filter((v) => v.seconds >= 60)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  // F) compute total watch time
  const totalSeconds = filtered.reduce((sum, v) => sum + v.seconds, 0)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  // G) render
  return (
    <section id="videos" className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title in gold to match navbar */}
        <h2 className="text-3xl font-extrabold text-[#D4AF37] mb-2">
          All Our YouTube Videos
        </h2>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <VideoCard
                key={v.id}
                title={v.title}
                thumbnail={v.thumbnail}
                url={v.url}
                publishedAt={v.publishedAt}
                seconds={v.seconds}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No videos to display right now.
          </p>
        )}
      </div>
    </section>
  )
}

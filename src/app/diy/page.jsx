// src/components/DIY.jsx
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaStar, FaRegStar } from "react-icons/fa"

export default function DIY() {
  const projects = useMemo(() => [
    {
      title: "Blink Mini Cam 2 LCD Mount for Bambu A1",
      description:
        "Keep an eye on your prints with this custom mount for the Bambu A1’s LCD & Blink Mini Cam 2—perfect viewing angle plus integrated cable clip.",
      profile: "0.2 mm layer, 2 walls, 15 % infill",
      printTime: "1.1 h",
      plates: "1 plate",
      rating: "4.8",
      reviews: 13,
      license: "Standard Digital File License",
      link: "https://makerworld.com/en/models/935183-blink-mini-cam-2-lcd-mount-for-bambu-a1",
      img: "https://makerworld.bblmw.com/makerworld/model/US1c639052145250/design/2025-01-02_23269f908c65c.jpg?x-oss-process=image/resize,w_1000/format,webp",
    },
    {
      title: "Cable Extender Lock – Secure Your Cables",
      description:
        "Stabilize & organize: this extender lock keeps your adapters firmly connected and your workspace tangle‑free.",
      profile: "0.2 mm layer, 2 walls, 15 % infill",
      printTime: "0.4 h",
      plates: "1 plate",
      rating: "4.7",
      reviews: 3,
      license: "CC BY‑NC‑SA",
      link: "https://makerworld.com/en/models/887267-cable-extender-lock-secure-your-cables",
      img: "https://makerworld.com/en/models/935183-blink-mini-cam-2-lcd-mount-for-bambu-a1",
    },
  ], [])

  // filter state
  const [filter, setFilter] = useState("")

  // apply search filter
  const filtered = useMemo(() => {
    if (!filter) return projects
    return projects.filter(p =>
      p.title.toLowerCase().includes(filter.toLowerCase())
    )
  }, [filter, projects])

  // total print time
  const totalHours = useMemo(() => {
    const sum = projects.reduce((acc, p) => acc + parseFloat(p.printTime), 0)
    return sum.toFixed(1)
  }, [projects])

  return (
    <section id="diy" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-[#facc15] mb-4">
          DIY 3D‑Print Projects
        </h2>

        {/* smart bar: total time + search */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-300">
            ⏱️ Total print time: <span className="font-medium">{totalHours} h</span>
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 placeholder-gray-500 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#facc15]"
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((p) => {
              const ratingVal = parseFloat(p.rating)
              const fullStars = Math.floor(ratingVal)
              return (
                <div
                  key={p.title}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                    <p className="text-gray-300 mb-4">{p.description}</p>

                    <ul className="text-sm text-gray-400 mb-4 space-y-1">
                      <li>
                        <strong>Print profile:</strong> {p.profile}
                      </li>
                      <li>
                        <strong>Print time:</strong> {p.printTime}, {p.plates}
                      </li>
                      <li className="flex items-center gap-1">
                        <strong>Rating:</strong>
                        {Array.from({ length: 5 }).map((_, i) =>
                          i < fullStars ? (
                            <FaStar key={i} className="text-yellow-400" />
                          ) : (
                            <FaRegStar key={i} className="text-gray-600" />
                          )
                        )}
                        <span className="ml-2 text-gray-300">
                          {p.rating} ({p.reviews})
                        </span>
                      </li>
                      <li>
                        <strong>License:</strong> {p.license}
                      </li>
                    </ul>

                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#facc15] hover:bg-yellow-400 text-[#1e293b] font-semibold rounded px-4 py-2 transition"
                    >
                      View on MakerWorld
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No projects found.</p>
        )}
      </div>
    </section>
  )
}

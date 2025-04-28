// src/components/Hero.jsx
"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [images, setImages] = useState([])
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const isFirst = useRef(true)

  // 1) Fetch your list once
  useEffect(() => {
    fetch('/api/hero-images')
      .then((r) => r.json())
      .then((imgs) => {
        setImages(imgs)
        const start = Math.floor(Math.random() * imgs.length)
        setCurrent(start)
        setPrev(start)
      })
  }, [])

  // 2) Every 20s pick a new non‑repeating image
  useEffect(() => {
    if (!images.length) return
    const iv = setInterval(() => {
      setPrev(current)
      let next
      do {
        next = Math.floor(Math.random() * images.length)
      } while (next === current)
      setCurrent(next)
      isFirst.current = false
    }, 20000)
    return () => clearInterval(iv)
  }, [current, images])

  // 3) Trigger the fade‑in animation when `current` changes
  useEffect(() => {
    if (isFirst.current) return
    setFadeIn(false)
    const t = setTimeout(() => setFadeIn(true), 50)
    return () => clearTimeout(t)
  }, [current])

  if (!images.length) return null

  const currImg = images[current]
  const prevImg = images[prev]

  const layerStyle = (url, opacity = 1) => ({
    backgroundImage: `url('${url}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(4px)',
    transform: 'scale(1.03)',
    opacity,
  })

  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(100vh-4rem)] sm:h-screen overflow-hidden"
    >
      {/* Previous background (static until new one fully fades in) */}
      <div
        key={`prev-${prev}`}
        className="absolute inset-0"
        style={layerStyle(prevImg, 1)}
      />

      {/* Current background (fades in over 6 seconds) */}
      <div
        key={`curr-${current}`}
        className="absolute inset-0 transition-opacity ease-in-out duration-[6000ms]"
        style={layerStyle(currImg, fadeIn ? 1 : 0)}
      />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Chevron indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <span className="block w-6 h-6 border-b-2 border-r-2 border-white rotate-45 animate-[bounce_2s_infinite]" />
      </div>

      {/* Foreground content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-extrabold drop-shadow-lg leading-tight opacity-0 animate-fadeIn">
          Join Andy &amp; Gianna<br />
          Chasing Thrills &amp; Making Memories
        </h1>
        <p className="text-white text-base sm:text-lg md:text-2xl max-w-2xl opacity-0 animate-fadeIn delay-200">
          Cinematic coaster POVs, park‑hacks, and off‑the‑beaten‑path adventures—live free, ride together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fadeIn delay-400">
          <Link
            href="/#videos"
            className="px-8 py-4 bg-[#facc15] hover:bg-yellow-400 text-[#1e293b] font-semibold rounded uppercase tracking-wide transition"
          >
            Watch Videos
          </Link>
          <a
            href="https://www.youtube.com/@WeAreSimplyAG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#1e293b] font-semibold rounded uppercase tracking-wide transition"
          >
            Subscribe
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  )
}

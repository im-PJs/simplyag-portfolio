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
    }, 20000) // 20 seconds between changes
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

  const commonStyles = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    transform: 'scale(1.05)',
  }

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {/* previous image (static until new one fully fades in) */}
      <div
        key={`prev-${prev}`}
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${prevImg}')`,
          ...commonStyles,
        }}
      />

      {/* current image (fades in over 8 seconds) */}
      <div
        key={`curr-${current}`}
        className="absolute inset-0 transition-opacity ease-in-out"
        style={{
          backgroundImage: `url('${currImg}')`,
          opacity: fadeIn ? 1 : 0,
          transitionDuration: '8000ms', // 8s fade
          ...commonStyles,
        }}
      />

      {/* dark tint overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      />

      {/* foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-4">
          Your Front‑Row Pass to Coasters & Travel
        </h1>
        <p className="text-white text-base md:text-xl mb-8 max-w-xl">
          We’re Andy & Gianna—sharing ride‑throughs, park tips, and DIY projects.
        </p>
        <Link
          href="#videos"
          className="px-6 py-3 bg-[#facc15] hover:bg-yellow-400 text-[#1e293b] font-semibold rounded uppercase tracking-wider transition-colors"
        >
          Watch Videos
        </Link>
      </div>
    </section>
  )
}

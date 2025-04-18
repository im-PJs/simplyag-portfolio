// src/components/About.jsx
"use client"
import Image from "next/image"

export default function About() {
  return (
    <section id="about" className="py-16 bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-4xl font-extrabold">About Us</h2>
          <p className="text-gray-300 leading-relaxed">
            We’re Andy & Gianna, and we love chasing thrills at theme parks,
            exploring new places, and sharing DIY adventures. Thanks for being here!
          </p>
        </div>
        <div className="md:w-1/2">
          <Image
            src="/images/about.jpg"
            alt="Andy and Gianna"
            width={800}
            height={1000}
            className="rounded-lg shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  )
}

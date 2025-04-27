// About.jsx – Our Story section with cinematic pop
// Updated: April 21, 2025

import Image from "next/image";

const About = () => {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-20 md:py-32 bg-gradient-to-br from-[#0f1c2e] to-[#112140] text-white">
      {/* Decorative color blobs */}
      <div className="absolute -left-20 top-8 w-80 h-80 bg-yellow-500 opacity-10 rounded-full"></div>
      <div className="absolute -right-20 bottom-8 w-96 h-96 bg-pink-400 opacity-10 rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Column */}
        <div className="space-y-6">
          <h2 className="relative inline-block text-4xl font-bold drop-shadow-xl">
            Our Story
            <span className="absolute left-0 -bottom-1 w-20 h-1 bg-yellow-500 rounded-full"></span>
          </h2>

          <p className="text-lg leading-relaxed text-gray-300 border-l-4 border-yellow-500 pl-4">
            We’re Andy & Gianna — a guy and a girl who met in 2022, and since then, we’ve been figuring out life one ride at a time.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            We started this channel to document our memories for us to watch in the future. Nothing crazy — just real life, captured as it happens. From late‑night coaster runs to weekend getaways, DIY projects to spontaneous moments, we film the little things that make life ours.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            We’re chasing this thing called life — together. Trying to live free. Choosing our own path. Just me and her, making the most of it, one adventure at a time.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            SimplyAG is our way of remembering it all. And if our story happens to make you smile, inspire a trip, or remind you to enjoy the ride — that’s pretty cool too.
          </p>
        </div>

        {/* Image Column */}
        <div className="flex justify-center">
          <div className="rounded-full overflow-hidden shadow-2xl ring-2 ring-white/10 ring-offset-2 ring-offset-[#0f1c2e] transition hover:ring-yellow-400/30 duration-300 ease-in-out">
            <Image
              src="/images/about-us.png"
              alt="Andy and Gianna smiling"
              width={600}
              height={600}
              className="object-cover w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

// src/app/page.jsx
import Hero   from "../components/Hero"
import Videos from "../components/Videos"
import About  from "../components/About"

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      <section id="home">
        <Hero />
      </section>

      {/* Videos section */}
      <section id="videos">
        <Videos />
      </section>

      {/* About section */}
      <section id="about">
        <About />
      </section>

      {/* ...other homepage sections */}
    </>
  )
}

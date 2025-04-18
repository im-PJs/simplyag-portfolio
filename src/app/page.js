import Hero from "../components/Hero"
import Videos from "../components/Videos"
import About from "../components/About"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Videos />
      <About />
      {/* later: <DIY /> <Blog /> <Contact /> */}
    </>
  )
}

// src/components/NavBar.jsx
"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function NavBar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // 1) header background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // 2) handle initial hash on "/"
  useEffect(() => {
    if (pathname === "/") {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: "smooth" })
            if (hash === "home") history.replaceState(null, "", "/")
          }
        }, 50)
      }
    }
  }, [pathname])

  const menuItems = [
    { label: "Videos", href: "/#videos" },
    { label: "Merch", href: "https://SimplyAGCreations.etsy.com/" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/#about" },
  ]

  // 3) Helper to render a menu link properly (external vs internal)
  const renderLink = ({ label, href }, onClick) => {
    const isExternal = href.startsWith("http")
    return isExternal ? (
      <a
        key={href}
        href={href}
        className="nav-link"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {label}
      </a>
    ) : (
      <Link key={href} href={href} className="nav-link" onClick={onClick}>
        {label}
      </Link>
    )
  }

  return (
    <>
      <header className={scrolled ? "header scrolled" : "header"}>
        <div className="inner">
          <Link href="/#home" className="logo">
            SimplyAG
          </Link>

          <nav className="desktop">
            {menuItems.map((item) => renderLink(item))}
            <Link href="/contact" className="cta">
              Get in Touch
            </Link>
          </nav>

          <button
            className="toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile">
            {menuItems.map((item) => renderLink(item, () => setMenuOpen(false)))}
            <Link href="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
              Get in Touch
            </Link>
          </nav>
        )}
      </header>

      <style jsx global>{`
        :root {
          --gold: #D4AF37;
          --navy-rgb: 30, 41, 59;
        }
        html {
          scroll-behavior: smooth;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(var(--navy-rgb), 0.6);
          backdrop-filter: blur(8px);
          transition: background 0.3s, box-shadow 0.3s;
          z-index: 50;
        }
        .header.scrolled {
          background: rgba(var(--navy-rgb), 0.85);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 2rem;
          font-weight: 900;
          color: var(--gold);
          text-decoration: none;
        }

        .desktop {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          position: relative;
          color: var(--gold);
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          padding: 0.25rem 0;
          cursor: pointer;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, var(--gold), #ffd700);
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .cta {
          padding: 0.45rem 1.1rem;
          border: 2px solid var(--gold);
          border-radius: 9999px;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .cta:hover {
          background: var(--gold);
          color: #1e293b;
        }

        .toggle {
          display: none;
          background: none;
          border: none;
          color: var(--gold);
          font-size: 1.5rem;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .desktop {
            display: none;
          }
          .toggle {
            display: block;
          }
          .mobile {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            background: rgba(var(--navy-rgb), 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 1.5rem;
          }
          .mobile .nav-link {
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </>
  )
}

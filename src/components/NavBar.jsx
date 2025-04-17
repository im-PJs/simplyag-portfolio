// src/components/NavBar.jsx
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menu = ["About", "Videos", "DIY", "Blog", "Contact"]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header className={scrolled ? "header scrolled" : "header"}>
        <div className="inner">
          <Link href="/" className="logo">
            SimplyAG
          </Link>

          <nav className="desktop">
            {menu.map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="nav-link"
              >
                {label}
              </Link>
            ))}
            <Link href="#contact" className="cta">
              Get in Touch
            </Link>
          </nav>

          <button
            className="toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <nav className="mobile">
            {menu.map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="nav-link"
              >
                {label}
              </Link>
            ))}
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="cta"
            >
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

        /* NAV CONTAINER */
        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          background: rgba(var(--navy-rgb), 0.6);  /* always semi‑opaque */
          backdrop-filter: blur(8px);
          transition: background 0.3s, box-shadow 0.3s, border-bottom 0.3s;
          z-index: 50;
        }
        .header.scrolled {
          background: rgba(var(--navy-rgb), 0.85);
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        /* INNER WRAPPER */
        .inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* LOGO */
        .logo {
          font-size: 2rem !important;
          font-weight: 900 !important;
          color: var(--gold) !important;
          letter-spacing: 0.1em !important;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7) !important;
          text-decoration: none !important;
        }

        /* DESKTOP NAV */
        .desktop {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .nav-link {
          position: relative;
          color: var(--gold) !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          letter-spacing: 0.08em !important;
          font-size: 0.9rem !important;
          text-decoration: none !important;
          padding: 0.25rem 0 !important;
          transition: color 0.2s !important;
          text-shadow: 0 0 4px rgba(0,0,0,0.7) !important; /* boost contrast */
        }
        .nav-link::after {
          content: "" !important;
          position: absolute !important;
          left: 0; bottom: -3px;
          width: 0; height: 2px;
          background: linear-gradient(to right, var(--gold), #FFD700) !important;
          transition: width 0.3s ease !important;
        }
        .nav-link:hover {
          color: #FFD700 !important;
        }
        .nav-link:hover::after {
          width: 100% !important;
        }

        /* GHOST CTA */
        .cta {
          display: inline-block !important;
          padding: 0.45rem 1.1rem !important;
          border: 2px solid var(--gold) !important;
          border-radius: 9999px !important;
          color: var(--gold) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          text-decoration: none !important;
          transition: background 0.2s, color 0.2s !important;
        }
        .cta:hover {
          background: var(--gold) !important;
          color: #1e293b !important;
        }

        /* MOBILE TOGGLE */
        .toggle {
          display: none;
          background: none;
          border: none;
          color: var(--gold) !important;
          font-size: 1.5rem;
          cursor: pointer;
        }

        /* MOBILE NAV */
        @media (max-width: 768px) {
          .desktop {
            display: none !important;
          }
          .toggle {
            display: block !important;
          }
          .mobile {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 1.5rem;
            background: rgba(var(--navy-rgb), 0.95);
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </>
  )
}

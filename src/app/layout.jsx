// src/app/layout.jsx

import NavBar from '../components/NavBar'
import './globals.css'        // your existing Tailwind setup

export const metadata = {
  title: 'SimplyAG Portfolio',
  description: 'Cinematic Travel & Theme‑Park Vlogs by Andy & Gianna',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white">
        <NavBar />
        {children}
      </body>
    </html>
  )
}

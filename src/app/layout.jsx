// src/app/layout.jsx – Global layout wrapper for SimplyAG
// Imports shared styles, nav bar, and the floating social bar
// Updated: April 21, 2025

import NavBar from '../components/NavBar';
import SocialBar from '../components/SocialBar';
import './globals.css'; // your existing Tailwind setup

export const metadata = {
  title: 'SimplyAG Portfolio',
  description: 'Cinematic Travel & Theme‑Park Vlogs by Andy & Gianna',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white">
        <SocialBar />
        <NavBar />
        {children}
      </body>
    </html>
  );
}

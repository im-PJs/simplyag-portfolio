// src/app/api/hero-images/route.js
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'Hero')
  let files = await fs.readdir(dir)
  // filter to common image extensions
  files = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
  // prefix with /Hero so the client can load from public
  const images = files.map(f => `/Hero/${f}`)
  return new Response(JSON.stringify(images), {
    headers: { 'Content-Type': 'application/json' }
  })
}

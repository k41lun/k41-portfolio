import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'screenshots')
    if (!fs.existsSync(dir)) return NextResponse.json({ images: [] })
    const files = fs.readdirSync(dir)
    const images = files
      .filter(f => /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(f))
      .map(f => `/screenshots/${encodeURIComponent(f)}`)
    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ images: [] })
  }
}
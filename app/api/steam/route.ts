import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.STEAM_API_KEY
  const id  = process.env.STEAM_ID
  try {
    const res = await fetch(
      `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${id}&count=3&format=json`,
      { next: { revalidate: 300 } }
    )
    const data = await res.json()
    return NextResponse.json({ games: data.response?.games ?? [] })
  } catch {
    return NextResponse.json({ games: [] })
  }
}

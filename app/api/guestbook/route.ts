import { NextResponse } from 'next/server'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const headers = {
  'apikey': KEY!,
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
}

export async function GET() {
  try {
    const res = await fetch(
      `${URL}/rest/v1/k41guestbook?select=*&order=created_at.desc&limit=30`,
      { headers, next: { revalidate: 0 } }
    )
    const data = await res.json()
    return NextResponse.json({ messages: Array.isArray(data) ? data : [] })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(req: Request) {
  try {
    const { name, message } = await req.json()
    if (!name?.trim() || !message?.trim())
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })

    const res = await fetch(`${URL}/rest/v1/k41guestbook`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        name:    name.trim().slice(0, 50),
        message: message.trim().slice(0, 300),
      }),
    })
    if (!res.ok) throw new Error('Insert failed')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

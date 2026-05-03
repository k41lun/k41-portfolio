import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await supabase
      .from('k41guestbook')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
    if (error) throw error
    return NextResponse.json({ messages: data ?? [] })
  } catch {
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const userSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    })
    const { data: { user }, error: authError } = await userSupabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Invalid session — please sign in again.' }, { status: 401 })

    const { message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required.' }, { status: 400 })

    const name = user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.user_metadata?.global_name
      || 'Anonymous'

    const { error } = await userSupabase
      .from('k41guestbook')
      .insert({ name, message: message.trim().slice(0, 300) })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, name })
  } catch {
    return NextResponse.json({ error: 'Failed to save message.' }, { status: 500 })
  }
}
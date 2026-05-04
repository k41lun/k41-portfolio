'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { T, LANGS, type Lang } from './translations'
import { supabase } from './lib/supabase'

const DISCORD_ID = '763391716140384317'
const FFXIV_ID   = '42721750'

type Status = 'online' | 'idle' | 'dnd' | 'offline'
interface Spotify    { song: string; artist: string; album_art_url: string; track_id: string }
interface Lanyard    { discord_status: Status; listening_to_spotify: boolean; spotify: Spotify | null }
interface FFXIVData  { Name: string; Avatar: string; Title: { Name: string }; ActiveClassJob: { Job: { Abbreviation: string }; Level: number } }
interface SteamGame  { appid: number; name: string; playtime_2weeks: number; playtime_forever: number; img_icon_url: string }
interface GuestEntry { id: number; name: string; message: string; created_at: string }

const STATUS_COLOR: Record<Status, string> = { online:'#00ff9f', idle:'#faa81a', dnd:'#ff006e', offline:'#555' }
const STATUS_LABEL: Record<Status, string>  = { online:'ONLINE', idle:'IDLE', dnd:'DO NOT DISTURB', offline:'OFFLINE' }

const GAMES = [
  { id:'ffxiv', name:'Final Fantasy XIV', sub:'Grande Pingus · Kujata', title:'Master of the Sea', href:'https://eu.finalfantasyxiv.com/lodestone/character/42721750/', accent:'#ffd700', glow:'rgba(255,215,0,0.2)',  icon:'/icons/ffxiv.ico',     splash:'/splash/ffxiv.png' },
  { id:'vrc',   name:'VRChat',            sub:'萍萍<3',                  title:'Social explorer',  href:'https://vrchat.com/home/user/usr_6c4355d9-6f7e-4df0-a616-4577802cd5e2', accent:'#00b4ff', glow:'rgba(0,180,255,0.2)', icon:'/icons/vrchat.ico',    splash:'/splash/vrchat.png' },
  { id:'sc',    name:'Star Citizen',      sub:'RecycleEmAll',            title:'Verse explorer',   href:'https://robertsspaceindustries.com/en/citizens/RecycleEmAll', accent:'#7b2fff', glow:'rgba(123,47,255,0.2)', icon:'/icons/rsiwhite.png', splash:'/splash/starcitizen.png' },
  { id:'d2',    name:'Destiny 2',         sub:'rccea#1277',              title:'Guardian',         href:'https://www.bungie.net/7/en/User/Profile/3/4611686018519700375?bgn=rccea', accent:'#ff6b00', glow:'rgba(255,107,0,0.2)', icon:'/icons/destiny.ico',   splash:'/splash/destiny.png' },
]

const PLATFORMS = [
  { name:'Steam',      handle:'RC',                 href:'https://steamcommunity.com/profiles/76561199102075092', color:'#c6d4df', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0z"/></svg> },
  { name:'Discord',    handle:'rccea',              href:'https://discord.com/users/763391716140384317', color:'#5865f2', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.013.04.029.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg> },
  { name:'X (Twitter)',handle:'@PingPingVRC',       href:'https://x.com/PingPingVRC', color:'#e7e7e7', icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { name:'Battle.net', handle:'RecycleEmAll#1683',  href:'https://battle.net', color:'#148eff', icon:<img src="/icons/battle.net.ico" alt="Battle.net" width={20} height={20} style={{objectFit:'contain'}} /> },
]

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function lastSeenAgo(ts: number | null) {
  if (!ts) return null
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

const THEME_COLORS = {
  dark: {
    particles:  ['#ff006e','#00b4ff','#7b2fff','#00ff9f','#ff6b00'],
    connection: [255, 0, 110],
    cursor:     ['#ff006e','#00b4ff','#7b2fff','#00ff9f'],
  },
  light: {
    particles:  ['#ff8800','#ffcc00','#ff5500','#e06000','#ffaa22'],
    connection: [255, 140, 0],
    cursor:     ['#ff8800','#ffcc00','#ff5500','#ffaa33'],
  },
}

export default function Page() {
  const particleRef = useRef<HTMLCanvasElement>(null)
  const cursorRef   = useRef<HTMLCanvasElement>(null)
  const rainRef     = useRef<HTMLCanvasElement>(null)

  const [lanyard,       setLanyard]       = useState<Lanyard | null>(null)
  const [ffxiv,         setFfxiv]         = useState<FFXIVData | null>(null)
  const [visitors,      setVisitors]      = useState<number | null>(null)
  const [lightbox,      setLightbox]      = useState<string | null>(null)
  const [screenshots,   setScreenshots]   = useState<string[]>([])
  const [shotPage,      setShotPage]      = useState(0)
  const [steamGames,    setSteamGames]    = useState<SteamGame[]>([])
  const [messages,      setMessages]      = useState<GuestEntry[]>([])
  const [gName,         setGName]         = useState('')
  const [gMsg,          setGMsg]          = useState('')
  const [gLoading,      setGLoading]      = useState(false)
  const [gDone,         setGDone]         = useState(false)
  const [showTop,       setShowTop]       = useState(false)
  const [lastSeen,      setLastSeen]      = useState<number | null>(null)
  const [theme,         setTheme]         = useState<'dark'|'light'>('dark')
  const [lang,          setLang]          = useState<Lang>('en')
  const [scrollPct,     setScrollPct]     = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [showPlayer,    setShowPlayer]    = useState(false)
  const themeRef = useRef<'dark'|'light'>('dark')
  const SHOTS_PER_PAGE = 6
  const t = T[lang]

  const SECTIONS = [
    { id: 'hero',        label: 'Home' },
    { id: 'games',       label: 'Games' },
    { id: 'steam',       label: 'Steam' },
    { id: 'screenshots', label: 'Screenshots' },
    { id: 'platforms',   label: 'Socials' },
    { id: 'guestbook',   label: 'Guestbook' },
  ]

  // Particle background
  useEffect(() => {
    const canvas = particleRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const pts = Array.from({length:90}, () => {
      const cols = THEME_COLORS[themeRef.current].particles
      return { x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, r:Math.random()*1.6+.4, c:cols[Math.floor(Math.random()*cols.length)] }
    })
    let id: number
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      const conn = THEME_COLORS[themeRef.current].connection
      const cols = THEME_COLORS[themeRef.current].particles
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) { const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy); if(d<130){ctx.beginPath();ctx.strokeStyle=`rgba(${conn[0]},${conn[1]},${conn[2]},${.12*(1-d/130)})`;ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()} }
      pts.forEach(p=>{
        p.c = cols[Math.floor(Math.random()*cols.length)] // gradually update colors
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill()
        p.x+=p.vx;p.y+=p.vy
        if(p.x<0||p.x>canvas.width)p.vx*=-1
        if(p.y<0||p.y>canvas.height)p.vy*=-1
      })
      id=requestAnimationFrame(draw)
    }; draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize) }
  }, [])

  // Cursor trail
  useEffect(() => {
    const canvas = cursorRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    window.addEventListener('resize', () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight })
    type Dot = { x:number; y:number; age:number; color:string; size:number }
    const dots: Dot[] = []
    const onMove = (e: MouseEvent) => {
      const tc = THEME_COLORS[themeRef.current].cursor
      for(let i=0;i<3;i++) dots.push({x:e.clientX+(Math.random()-0.5)*8,y:e.clientY+(Math.random()-0.5)*8,age:0,color:tc[Math.floor(Math.random()*tc.length)],size:Math.random()*3+1})
    }
    window.addEventListener('mousemove', onMove)
    let id: number
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for(let i=dots.length-1;i>=0;i--){ dots[i].age++; if(dots[i].age>25){dots.splice(i,1);continue} const a=1-dots[i].age/25; ctx.globalAlpha=a; ctx.beginPath(); ctx.arc(dots[i].x,dots[i].y,dots[i].size*(1-dots[i].age/25),0,Math.PI*2); ctx.fillStyle=dots[i].color; ctx.fill() }
      ctx.globalAlpha=1; id=requestAnimationFrame(draw)
    }; draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('mousemove',onMove) }
  }, [])

  // Icon rain
  useEffect(() => {
    const canvas = rainRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const ICONS = ['/icons/ffxiv.ico', '/icons/vrchat.ico', '/icons/destiny.ico', '/icons/rsiwhite.png']
    const imgs: HTMLImageElement[] = ICONS.map(src => { const i = new Image(); i.src = src; return i })
    type Drop = { x:number; y:number; speed:number; size:number; opacity:number; rot:number; rotV:number; wobble:number; wobbleV:number; imgIdx:number }
    const opacityRange = [0.18, 0.04]
    const mkDrop = (randomY = false): Drop => ({
      x: Math.random() * (canvas.width || window.innerWidth),
      y: randomY ? Math.random() * window.innerHeight : -60,
      speed: Math.random() * 1.2 + 0.5,
      size:  Math.random() * 18 + 14,
      opacity: Math.random() * opacityRange[0] + opacityRange[1],
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.015,
      wobble: Math.random() * Math.PI * 2,
      wobbleV: Math.random() * 0.018 + 0.008,
      imgIdx: Math.floor(Math.random() * ICONS.length),
    })
    const drops: Drop[] = Array.from({ length: 35 }, () => mkDrop(true))
    let id: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drops.forEach(d => {
        const img = imgs[d.imgIdx]
        if (img.complete && img.naturalWidth > 0) {
          ctx.save()
          ctx.globalAlpha = d.opacity
          ctx.translate(d.x + Math.sin(d.wobble) * 4, d.y)
          ctx.rotate(d.rot)
          ctx.drawImage(img, -d.size / 2, -d.size / 2, d.size, d.size)
          ctx.restore()
        }
        d.y += d.speed; d.rot += d.rotV; d.wobble += d.wobbleV
        if (d.y > canvas.height + 60) Object.assign(d, mkDrop())
      })
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  // Theme + language persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('pp_theme') as 'dark'|'light' | null
    const savedLang  = localStorage.getItem('pp_lang') as Lang | null
    if (savedTheme) setTheme(savedTheme)
    if (savedLang)  setLang(savedLang)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('pp_theme', theme)
    themeRef.current = theme
  }, [theme])
  useEffect(() => { localStorage.setItem('pp_lang', lang) }, [lang])

  // Scroll — progress + active section + back to top
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? scrolled / total : 0)
      setShowTop(scrolled > 400)
      // Detect active section
      const ids = SECTIONS.map(s => s.id)
      let current = 0
      ids.forEach((id, i) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = i
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lanyard
  useEffect(() => {
    const stored = localStorage.getItem('pp_last_seen')
    if (stored) setLastSeen(Number(stored))
    const fetch_ = () => fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`).then(r=>r.json()).then(d=>{
      if (!d.success) return
      setLanyard(d.data)
      if (d.data.discord_status !== 'offline') {
        const now = Date.now()
        localStorage.setItem('pp_last_seen', String(now))
        setLastSeen(now)
      }
    }).catch(()=>{})
    fetch_(); const iv = setInterval(fetch_, 15000); return () => clearInterval(iv)
  }, [])

  // FFXIV
  useEffect(() => {
    fetch(`https://xivapi.com/character/${FFXIV_ID}?columns=Character.Name,Character.Title.Name,Character.ActiveClassJob.Job.Abbreviation,Character.ActiveClassJob.Level,Character.Avatar`)
      .then(r=>r.json()).then(d=>{ if(d.Character) setFfxiv(d.Character) }).catch(()=>{})
  }, [])

  // Screenshots
  useEffect(() => {
    fetch('/api/screenshots').then(r=>r.json()).then(d=>setScreenshots(d.images??[])).catch(()=>{})
  }, [])

  // Steam
  useEffect(() => {
    fetch('/api/steam').then(r=>r.json()).then(d=>setSteamGames(d.games??[])).catch(()=>{})
  }, [])

  // Guestbook
  const loadMessages = useCallback(() => {
    fetch('/api/guestbook').then(r=>r.json()).then(d=>setMessages(d.messages??[])).catch(()=>{})
  }, [])
  useEffect(() => { loadMessages() }, [loadMessages])

  // Visitor counter
  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/k41au/page/up').then(r=>r.json()).then(d=>{ if(d.count) setVisitors(d.count) }).catch(()=>{})
  }, [])

  const [gError, setGError] = useState('')
  const [user,   setUser]   = useState<any>(null)

  // Auth state
  useEffect(() => {
    // Listen first so we catch the INITIAL_SESSION event from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    // Also re-check after short delay to handle OAuth hash processing timing
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })
    }, 800)
    return () => { clearTimeout(timer); subscription.unsubscribe() }
  }, [])

  const signInWithDiscord = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setGDone(false)
  }

  const handleGuestSubmit = async () => {
    if (!user || !gMsg.trim()) return
    setGLoading(true)
    setGError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ message: gMsg })
      })
      if (res.ok) {
        setGDone(true)
        setGMsg('')
        loadMessages()
      } else {
        const data = await res.json()
        setGError(data.error || 'Something went wrong.')
      }
    } catch {
      setGError('Network error — try again.')
    }
    setGLoading(false)
  }

  const STATUS_LABEL_T: Record<Status, string> = { online: t.online, idle: t.idle, dnd: t.dnd, offline: t.offline }
  const status      = lanyard?.discord_status ?? 'offline'
  const statusColor = STATUS_COLOR[status]
  const statusLabel = STATUS_LABEL_T[status]
  const isOffline   = status === 'offline'

  return (
    <>
      <canvas ref={particleRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',opacity:.7}} />
      <canvas ref={rainRef}     style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}} />
      <canvas ref={cursorRef}   style={{position:'fixed',inset:0,zIndex:999,pointerEvents:'none'}} />

      {/* Theme + Language controls */}
      <div className="top-controls">
        {LANGS.map(l => (
          <button key={l.code} className={`lang-btn${lang===l.code?' active':''}`} onClick={()=>setLang(l.code)}>{l.label}</button>
        ))}
        <div style={{width:'1px',height:'16px',background:'rgba(255,0,110,0.2)',margin:'0 2px'}} />
        <button className="theme-btn" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} title="Toggle theme">
          {theme==='dark' ? '☀' : '🌙'}
        </button>
      </div>

      {/* Left — scroll progress + Spotify */}
      <div className="sidebar-left" style={{position:'fixed',left:'20px',top:'50%',transform:'translateY(-50%)',zIndex:100,display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',pointerEvents:'none'}}>
        <span style={{fontSize:'10px',color:'var(--pink)',letterSpacing:'.15em',writingMode:'vertical-rl',fontFamily:"'Chakra Petch',monospace",fontWeight:600,marginBottom:'6px'}}>k41.au</span>
        <div style={{width:'4px',height:'140px',background:'rgba(255,0,110,0.2)',borderRadius:'2px',position:'relative',overflow:'hidden',boxShadow:'0 0 8px rgba(255,0,110,0.1)'}}>
          <div style={{position:'absolute',top:0,left:0,width:'100%',background:theme==='light'?'#ff8800':'var(--pink)',borderRadius:'2px',boxShadow:theme==='light'?'0 0 12px rgba(255,136,0,0.9)':'0 0 12px rgba(255,0,110,0.9)',transition:'height .1s linear',height:`${scrollPct*100}%`}} />
        </div>
        <span style={{fontSize:'10px',color:'var(--pink)',letterSpacing:'.1em',fontFamily:"'Chakra Petch',monospace",fontWeight:600,marginTop:'4px',opacity:.8}}>{Math.round(scrollPct*100)}%</span>

        {/* Spotify toggle */}
        <button
          onClick={()=>setShowPlayer(p=>!p)}
          style={{
            pointerEvents:'all',marginTop:'12px',
            width:'40px',height:'40px',borderRadius:'50%',
            background: showPlayer ? 'rgba(30,215,96,0.3)' : 'rgba(30,215,96,0.12)',
            border:`2px solid ${showPlayer ? 'rgba(30,215,96,0.9)' : 'rgba(30,215,96,0.5)'}`,
            cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
            transition:'all .2s',
            boxShadow: showPlayer ? '0 0 16px rgba(30,215,96,0.5)' : '0 0 8px rgba(30,215,96,0.2)',
          }}
          title="Toggle music player"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1ed760"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
        </button>
        <span style={{fontSize:'9px',color:'#1ed760',letterSpacing:'.08em',fontFamily:"'Chakra Petch',monospace",opacity:.7,pointerEvents:'none'}}>music</span>
      </div>

      
      {/* Mobile floating balls — Spotify + Discord (only on mobile) */}
      <button
        className="mobile-float-btn"
        onClick={() => setShowPlayer(p => !p)}
        style={{
          position:'fixed', bottom:'96px', left:'20px', zIndex:100,
          width:'46px', height:'46px', borderRadius:'50%',
          background: showPlayer ? 'rgba(30,215,96,0.25)' : 'rgba(30,215,96,0.1)',
          border: `2px solid ${showPlayer ? 'rgba(30,215,96,0.8)' : 'rgba(30,215,96,0.4)'}`,
          cursor:'pointer', alignItems:'center', justifyContent:'center',
          boxShadow: showPlayer ? '0 0 20px rgba(30,215,96,0.4)' : '0 0 10px rgba(30,215,96,0.15)',
          transition:'all .2s', backdropFilter:'blur(8px)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1ed760"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
      </button>

      {/* Mobile floating Discord ball (only on mobile) */}

      <a
        href="https://discord.gg/FDmJNxyjc"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-float-btn"
        style={{
          position:'fixed', bottom:'40px', left:'20px', zIndex:100,
          width:'46px', height:'46px', borderRadius:'50%',
          background:'rgba(88,101,242,0.12)',
          border:'2px solid rgba(88,101,242,0.5)',
          cursor:'pointer', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 12px rgba(88,101,242,0.25)',
          transition:'all .2s', backdropFilter:'blur(8px)', textDecoration:'none',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865f2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.013.04.029.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
      </a>

      {showPlayer && (
      <div className="spotify-panel" style={{
        position:'fixed', left:'68px',
        bottom:'60px', zIndex:99,
        width:'240px',
        borderRadius:'12px', overflow:'hidden',
        border:'2px solid rgba(30,215,96,0.4)',
        boxShadow:'0 0 40px rgba(30,215,96,0.2)',
        background:'#121212',
      }}>
        <div style={{position:'relative'}}>
          <div id="sp-skeleton" style={{
            position:'absolute',inset:0,
            background:'#121212',
            display:'flex',flexDirection:'column',
            alignItems:'center',justifyContent:'center',
            gap:'12px', zIndex:1,
            transition:'opacity .4s',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="rgba(30,215,96,0.4)"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            <span style={{fontSize:'11px',color:'rgba(30,215,96,0.5)',fontFamily:"'Chakra Petch',monospace",letterSpacing:'.1em'}}>loading...</span>
          </div>
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DWYsgjETBHY6m?utm_source=generator&theme=0"
            width="240" height="352" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy" style={{display:'block',opacity:0,transition:'opacity .4s'}}
            onLoad={e => {
              const iframe = e.currentTarget
              const skeleton = document.getElementById('sp-skeleton')
              iframe.style.opacity = '1'
              if (skeleton) skeleton.style.opacity = '0'
              setTimeout(() => { if (skeleton) skeleton.style.display = 'none' }, 400)
            }}
          />
        </div>
      </div>
      )}
      <div className="sidebar-right" style={{position:'fixed',right:'20px',top:'50%',transform:'translateY(-50%)',zIndex:100,display:'flex',flexDirection:'column',alignItems:'center',gap:'14px'}}>
        {SECTIONS.map((s,i) => (
          <div key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})}
            style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',flexDirection:'row-reverse',padding:'6px 0'}}
            title={s.label}
          >
            <div style={{
              width: i===activeSection ? '12px' : '8px',
              height: i===activeSection ? '12px' : '8px',
              borderRadius:'50%',
              background: i===activeSection ? (theme==='light'?'#ff8800':'var(--pink)') : (theme==='light'?'rgba(255,136,0,0.45)':'rgba(255,0,110,0.45)'),
              boxShadow: i===activeSection ? (theme==='light'?'0 0 14px rgba(255,136,0,0.9), 0 0 28px rgba(255,136,0,0.4)':'0 0 14px rgba(255,0,110,0.9), 0 0 28px rgba(255,0,110,0.4)') : (theme==='light'?'0 0 6px rgba(255,136,0,0.3)':'0 0 6px rgba(255,0,110,0.3)'),
              transition:'all .3s',
              flexShrink:0,
              border: i===activeSection ? 'none' : (theme==='light'?'1px solid rgba(255,136,0,0.6)':'1px solid rgba(255,0,110,0.6)'),
            }} />
            <span style={{
              fontSize:'10px',letterSpacing:'.12em',fontWeight:600,
              color: i===activeSection ? 'var(--pink)' : 'rgba(255,0,110,0.5)',
              fontFamily:"'Chakra Petch',monospace",
              transition:'all .3s',
              opacity: i===activeSection ? 1 : 0.6,
              transform: i===activeSection ? 'translateX(0)' : 'translateX(6px)',
              whiteSpace:'nowrap',
            }}>{s.label.toUpperCase()}</span>
          </div>
        ))}

        {/* Discord server invite */}
        <a
          href="https://discord.gg/FDmJNxyjc"
          target="_blank"
          rel="noopener noreferrer"
          title="Join earth.io"
          style={{
            marginTop:'10px',
            display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',
            padding:'10px 8px',
            background:'rgba(88,101,242,0.18)',
            border:'2px solid rgba(88,101,242,0.5)',
            borderRadius:'12px',
            textDecoration:'none',
            transition:'all .2s',
            width:'42px',
            boxShadow:'0 0 16px rgba(88,101,242,0.2)',
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='rgba(88,101,242,0.35)';el.style.borderColor='rgba(88,101,242,0.9)';el.style.boxShadow='0 0 24px rgba(88,101,242,0.5)'}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='rgba(88,101,242,0.18)';el.style.borderColor='rgba(88,101,242,0.5)';el.style.boxShadow='0 0 16px rgba(88,101,242,0.2)'}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865f2">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.013.04.029.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          <span style={{fontSize:'9px',color:'#8b9cf4',letterSpacing:'.04em',fontFamily:"'Chakra Petch',monospace",writingMode:'vertical-rl',lineHeight:1,fontWeight:600}}>earth.io</span>
        </a>
      </div>
      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
          style={{position:'fixed',bottom:'32px',right:'32px',zIndex:100,width:'42px',height:'42px',borderRadius:'50%',background:'rgba(255,0,110,0.15)',border:'1px solid rgba(255,0,110,0.4)',color:'#ff006e',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s',backdropFilter:'blur(8px)'}}
          onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,0,110,0.3)')}
          onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,0,110,0.15)')}
        >↑</button>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={()=>setLightbox(null)} style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out'}}>
          <img src={lightbox} alt="screenshot" style={{maxWidth:'90vw',maxHeight:'90vh',objectFit:'contain',borderRadius:'8px',border:'1px solid rgba(255,0,110,0.3)'}} />
          <span style={{position:'absolute',top:'24px',right:'32px',color:'#fff',fontSize:'28px',cursor:'pointer',opacity:.7}}>✕</span>
        </div>
      )}

      <main className="main-content" style={{position:'relative',zIndex:1,maxWidth:'780px',margin:'0 auto',padding:'clamp(40px,8vw,80px) clamp(16px,4vw,24px) 120px'}}>

        {/* ── Hero ── */}
        <section id="hero" className="fade-up" style={{marginBottom:'56px'}}>
          <div className="fade-up" style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'32px',padding:'5px 14px',border:`1px solid ${statusColor}40`,borderRadius:'20px',background:`${statusColor}0d`}}>
            <span className="status-dot" style={{background:statusColor,boxShadow:`0 0 0 0 ${statusColor}99`}} />
            <span style={{fontSize:'10px',letterSpacing:'.2em',color:statusColor,fontWeight:600}}>{statusLabel}</span>
            {isOffline && lastSeen && (
              <span style={{fontSize:'10px',color:'#4a4060',marginLeft:'4px'}}>· {t.lastSeen} {lastSeenAgo(lastSeen)}</span>
            )}
          </div>

          {/* Title */}
          <div style={{marginBottom:'16px'}}>
            <h1 className="glitch fade-up d1" data-text="PING" style={{fontSize:'clamp(72px,14vw,108px)',fontWeight:700,lineHeight:.85,letterSpacing:'-.03em',color:'#fff',display:'block',fontStyle:'italic'}}>PING</h1>
            <h1 className="glitch fade-up d2" data-text="PING" style={{fontSize:'clamp(72px,14vw,108px)',fontWeight:700,lineHeight:.85,letterSpacing:'-.03em',color:'var(--pink)',display:'block',fontStyle:'italic',textShadow:'0 0 20px rgba(255,0,110,0.8), 0 0 40px rgba(255,0,110,0.5), 0 0 80px rgba(255,0,110,0.3)'}}>PING</h1>
          </div>

          <div className="fade-up d3" style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'7px',marginBottom:'24px'}}>
            <span style={{fontSize:'11px',color:'#4a4060',letterSpacing:'.1em'}}>a.k.a.</span>
            {['萍萍<3','GrandePingus','RecycleEmAll'].map(a=>(<span key={a} className="alias-tag">{a}</span>))}
            <span style={{fontSize:'12px',color:'#4a4060'}}>· Melbourne, AU</span>
          </div>

          {/* Bio */}
          <div className="fade-up d4" style={{
            borderLeft:'2px solid rgba(255,0,110,0.4)',
            paddingLeft:'16px',
            paddingTop:'4px',
            paddingBottom:'4px',
            maxWidth:'380px',
            background:'rgba(255,0,110,0.03)',
            borderRadius:'0 6px 6px 0',
          }}>
            <span className="bio-line bio-line-1">{t.bio[0]}</span>
            <span className="bio-line bio-line-2">{t.bio[1]}</span>
            <span className="bio-line bio-line-3">{t.bio[2]}</span>
            <span className="bio-line bio-line-4">{t.bio[3]}</span>
          </div>
        </section>

        {/* ── Now Playing ── */}
        {lanyard?.listening_to_spotify && lanyard.spotify && (
          <section className="fade-up" style={{marginBottom:'16px'}}>
            <a href={`https://open.spotify.com/track/${lanyard.spotify.track_id}`} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',background:'rgba(30,215,96,0.06)',border:'1px solid rgba(30,215,96,0.2)',borderRadius:'10px',textDecoration:'none',color:'inherit',transition:'border-color .2s'}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(30,215,96,0.5)')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(30,215,96,0.2)')}
            >
              <img src={lanyard.spotify.album_art_url} alt="album" width={44} height={44} style={{borderRadius:'4px',flexShrink:0}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'11px',color:'#1ed760',letterSpacing:'.12em',fontWeight:600,marginBottom:'4px'}}>{t.nowPlaying}</div>
                <div style={{fontSize:'13px',fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{lanyard.spotify.song}</div>
                <div style={{fontSize:'11px',color:'#4a4060',marginTop:'2px'}}>{lanyard.spotify.artist}</div>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:'3px',height:'20px',flexShrink:0}}>
                {[1,2,3,4].map(i=>(<div key={i} style={{width:'3px',background:'#1ed760',borderRadius:'2px',animation:`bar ${0.5+i*0.15}s ease-in-out infinite alternate`}} />))}
              </div>
            </a>
          </section>
        )}

        {/* ── FFXIV Card ── */}
        {ffxiv && (
          <section className="fade-up" style={{marginBottom:'40px'}}>
            <a href="https://eu.finalfantasyxiv.com/lodestone/character/42721750/" target="_blank" rel="noopener noreferrer"
              style={{display:'flex',alignItems:'center',gap:'14px',padding:'14px 16px',background:'rgba(255,215,0,0.05)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'10px',textDecoration:'none',color:'inherit',transition:'border-color .2s'}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(255,215,0,0.5)')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,215,0,0.2)')}
            >
              <img src={ffxiv.Avatar} alt="character" width={48} height={48} style={{borderRadius:'50%',border:'2px solid rgba(255,215,0,0.4)',flexShrink:0}} />
              <div style={{flex:1}}>
                <div style={{fontSize:'11px',color:'#ffd700',letterSpacing:'.12em',fontWeight:600,marginBottom:'4px'}}>FINAL FANTASY XIV</div>
                <div style={{fontSize:'14px',fontWeight:600,color:'#fff'}}>{ffxiv.Name}</div>
                <div style={{fontSize:'11px',color:'#4a4060',marginTop:'2px'}}>{ffxiv.Title?.Name} · Lv{ffxiv.ActiveClassJob?.Level} {ffxiv.ActiveClassJob?.Job?.Abbreviation}</div>
              </div>
              <img src="/icons/ffxiv.ico" alt="ffxiv" width={28} height={28} style={{objectFit:'contain',opacity:.7,flexShrink:0}} />
            </a>
          </section>
        )}

        <hr className="divider" />

        {/* ── Games ── */}
        <section id="games" style={{marginBottom:'72px'}}>
          <div className="games-grid-mobile" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
            {GAMES.map((g,i)=>(
              <a key={g.id} href={g.href} target="_blank" rel="noopener noreferrer"
                className={`game-card fade-up d${i+5}`}
                style={{['--card-accent' as string]:g.accent,['--card-glow' as string]:g.glow,minHeight:'140px'}}
              >
                <div className="splash-bg" style={{backgroundImage:`url(${g.splash})`}} />
                <div className="splash-overlay" />
                <div style={{position:'relative',zIndex:2}}>
                  <img src={g.icon} alt={g.name} width={36} height={36} style={{objectFit:'contain',marginBottom:'10px',display:'block'}} />
                  <div style={{fontSize:'11px',fontWeight:600,color:'#fff',marginBottom:'4px'}}>{g.name}</div>
                  <div style={{fontSize:'10px',color:g.accent,marginBottom:'3px',opacity:.9}}>{g.sub}</div>
                  <div style={{fontSize:'10px',color:'var(--muted)'}}>{g.title}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Steam Recently Played ── */}
        {steamGames.length > 0 && (
          <section id="steam" style={{marginBottom:'72px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {steamGames.map(g=>(
                <a key={g.appid} href={`https://store.steampowered.com/app/${g.appid}`} target="_blank" rel="noopener noreferrer"
                  style={{display:'flex',alignItems:'center',gap:'14px',padding:'12px 16px',background:'rgba(198,212,223,0.04)',border:'1px solid rgba(198,212,223,0.1)',borderRadius:'10px',textDecoration:'none',color:'inherit',transition:'border-color .2s,background .2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(198,212,223,0.3)';e.currentTarget.style.background='rgba(198,212,223,0.08)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(198,212,223,0.1)';e.currentTarget.style.background='rgba(198,212,223,0.04)'}}
                >
                  <img src={`https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`} alt={g.name} width={40} height={40} style={{borderRadius:'6px',flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{g.name}</div>
                    <div style={{fontSize:'11px',color:'#4a4060',marginTop:'3px'}}>
                      {g.playtime_2weeks ? `${Math.round(g.playtime_2weeks/60)}h ${t.thisWeek}` : ''}{g.playtime_2weeks && g.playtime_forever ? ' · ' : ''}
                      {Math.round(g.playtime_forever/60)}h {t.total}
                    </div>
                  </div>
                  <span style={{fontSize:'11px',color:'#c6d4df',opacity:.5}}>↗</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <hr className="divider" />

        {/* ── Screenshots ── */}
        {screenshots.length > 0 && (
        <section id="screenshots" style={{marginBottom:'72px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
            <p className="lbl" style={{marginBottom:0,flex:1}}>{t.screenshots}</p>
            {screenshots.length > SHOTS_PER_PAGE && (
              <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0,marginLeft:'12px'}}>
                <button onClick={()=>setShotPage(p=>Math.max(0,p-1))} disabled={shotPage===0}
                  style={{width:'30px',height:'30px',borderRadius:'50%',border:'1px solid rgba(255,0,110,0.3)',background:'transparent',color:shotPage===0?'#2a1f3d':'#ff006e',cursor:shotPage===0?'not-allowed':'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
                <span style={{fontSize:'11px',color:'#4a4060',minWidth:'40px',textAlign:'center'}}>{shotPage+1} / {Math.ceil(screenshots.length/SHOTS_PER_PAGE)}</span>
                <button onClick={()=>setShotPage(p=>Math.min(Math.ceil(screenshots.length/SHOTS_PER_PAGE)-1,p+1))} disabled={shotPage>=Math.ceil(screenshots.length/SHOTS_PER_PAGE)-1}
                  style={{width:'30px',height:'30px',borderRadius:'50%',border:'1px solid rgba(255,0,110,0.3)',background:'transparent',color:shotPage>=Math.ceil(screenshots.length/SHOTS_PER_PAGE)-1?'#2a1f3d':'#ff006e',cursor:shotPage>=Math.ceil(screenshots.length/SHOTS_PER_PAGE)-1?'not-allowed':'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
              </div>
            )}
          </div>
          <div className="shot-grid">
            {screenshots.slice(shotPage*SHOTS_PER_PAGE,(shotPage+1)*SHOTS_PER_PAGE).map((src,i)=>(
              <div key={shotPage+'-'+i} onClick={()=>setLightbox(src)} className="shot-thumb" style={{backgroundImage:`url(${src})`}} />
            ))}
          </div>
          {screenshots.length > SHOTS_PER_PAGE && (
            <p style={{fontSize:'10px',color:'#2a1f3d',textAlign:'center',marginTop:'10px',letterSpacing:'.08em'}}>{screenshots.length} {t.totalShots}</p>
          )}
        </section>
        )}

        <hr className="divider" />

        {/* ── Platforms ── */}
        <section id="platforms" style={{marginBottom:'72px'}}>
          <div style={{display:'flex',flexDirection:'column'}}>
            {PLATFORMS.map((p,i)=>(
              <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className={`plat-row fade-up d${i+4}`}>
                <span style={{color:p.color,flexShrink:0}}>{p.icon}</span>
                <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:600}}>{p.name}</div><div style={{fontSize:'11px',color:'#4a4060',marginTop:'2px'}}>{p.handle}</div></div>
                <span style={{fontSize:'14px',color:'#4a4060'}}>↗</span>
              </a>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── Guestbook ── */}
        <section id="guestbook" style={{marginBottom:'72px'}}>

          {/* Auth state → form */}
          {!user ? (
            <div style={{marginBottom:'24px',padding:'24px',background:'rgba(88,101,242,0.06)',border:'1px solid rgba(88,101,242,0.2)',borderRadius:'10px',textAlign:'center'}}>
              <p style={{fontSize:'13px',color:'rgba(240,230,255,0.5)',marginBottom:'16px',lineHeight:1.6}}>Sign in with Discord to leave a message.</p>
              <button
                onClick={signInWithDiscord}
                style={{display:'inline-flex',alignItems:'center',gap:'10px',padding:'10px 22px',background:'#5865f2',border:'none',borderRadius:'8px',color:'#fff',fontSize:'13px',fontWeight:600,fontFamily:'inherit',cursor:'pointer',letterSpacing:'.04em',transition:'all .2s'}}
                onMouseEnter={e=>(e.currentTarget.style.background='#4752c4')}
                onMouseLeave={e=>(e.currentTarget.style.background='#5865f2')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.013.04.029.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Sign in with Discord
              </button>
            </div>
          ) : !gDone ? (
            <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,0,110,0.15)',borderRadius:'10px',padding:'20px',marginBottom:'24px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  {user.user_metadata?.avatar_url && (
                    <img src={user.user_metadata.avatar_url} alt="avatar" width={28} height={28} style={{borderRadius:'50%',border:'1px solid rgba(88,101,242,0.4)'}} />
                  )}
                  <span style={{fontSize:'12px',color:'#8b9cf4',fontWeight:600}}>
                    {user.user_metadata?.full_name || user.user_metadata?.name || 'Discord user'}
                  </span>
                </div>
                <button onClick={signOut} style={{fontSize:'10px',color:'#4a4060',background:'transparent',border:'none',cursor:'pointer',letterSpacing:'.06em',fontFamily:'inherit'}}>sign out</button>
              </div>
              <textarea
                value={gMsg} onChange={e=>setGMsg(e.target.value)} maxLength={300}
                placeholder={t.leaveMessage} rows={3}
                style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,0,110,0.2)',borderRadius:'6px',padding:'10px 14px',color:'var(--text)',fontSize:'13px',fontFamily:'inherit',outline:'none',resize:'none',marginBottom:'12px',boxSizing:'border-box'}}
                onFocus={e=>(e.target.style.borderColor='rgba(255,0,110,0.5)')}
                onBlur={e=>(e.target.style.borderColor='rgba(255,0,110,0.2)')}
              />
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'10px',color:'#2a1f3d'}}>{gMsg.length}/300</span>
                <button onClick={handleGuestSubmit} disabled={gLoading||!gMsg.trim()}
                  style={{padding:'8px 20px',background:gLoading||!gMsg.trim()?'rgba(255,0,110,0.1)':'rgba(255,0,110,0.2)',border:'1px solid rgba(255,0,110,0.4)',borderRadius:'6px',color:gLoading||!gMsg.trim()?'#4a4060':'#ff006e',fontSize:'12px',fontWeight:600,fontFamily:'inherit',cursor:gLoading||!gMsg.trim()?'not-allowed':'pointer',letterSpacing:'.08em',transition:'all .2s'}}>
                  {gLoading ? t.sending : t.sign}
                </button>
              </div>
              {gError && (
                <p style={{fontSize:'11px',color:'#ff4444',marginTop:'10px',padding:'8px 12px',background:'rgba(255,68,68,0.08)',border:'1px solid rgba(255,68,68,0.2)',borderRadius:'6px'}}>{gError}</p>
              )}
            </div>
          ) : (
            <div style={{padding:'16px',background:'rgba(0,255,159,0.06)',border:'1px solid rgba(0,255,159,0.2)',borderRadius:'10px',marginBottom:'24px',fontSize:'13px',color:'#00ff9f',textAlign:'center'}}>
              {t.thanks}
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {messages.map(m=>(
              <div key={m.id} style={{padding:'14px 16px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                  <span style={{fontSize:'12px',fontWeight:600,color:'var(--pink)'}}>{m.name}</span>
                  <span style={{fontSize:'10px',color:'#2a1f3d'}}>{timeAgo(m.created_at)}</span>
                </div>
                <p style={{fontSize:'13px',color:'rgba(240,230,255,0.6)',lineHeight:1.6,margin:0}}>{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && (
              <p style={{fontSize:'12px',color:'#2a1f3d',textAlign:'center',padding:'20px'}}>{t.noMessages}</p>
            )}
          </div>
        </section>

        <footer style={{textAlign:'center',fontSize:'11px',color:'#2a1f3d',letterSpacing:'.1em'}}>
          k41.au · {t.builtBy}
          {visitors && <span> · {visitors.toLocaleString()} {t.visitors}</span>}
        </footer>

      </main>
    </>
  )
}
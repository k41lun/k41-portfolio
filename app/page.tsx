'use client'

import type { FC } from 'react'

/* ─── Data ──────────────────────────────────────────────────────── */

const GAMES = [
  {
    id: 'ffxiv',
    name: 'Final Fantasy XIV',
    short: 'XIV',
    status: 'Grande Pingus · Kujata',
    color: '#c49a3c',
    bg: 'rgba(196, 154, 60, 0.08)',
    border: 'rgba(196, 154, 60, 0.25)',
    href: 'https://eu.finalfantasyxiv.com/lodestone/character/42721750/',
  },
  {
    id: 'vrchat',
    name: 'VRChat',
    short: 'VRC',
    status: '萍萍<3',
    color: '#00d4ff',
    bg: 'rgba(0, 212, 255, 0.08)',
    border: 'rgba(0, 212, 255, 0.25)',
    href: 'https://vrchat.com/home/user/usr_6c4355d9-6f7e-4df0-a616-4577802cd5e2',
  },
  {
    id: 'sc',
    name: 'Star Citizen',
    short: 'SC',
    status: 'RecycleEmAll',
    color: '#6699ff',
    bg: 'rgba(102, 153, 255, 0.08)',
    border: 'rgba(102, 153, 255, 0.25)',
    href: 'https://robertsspaceindustries.com/en/citizens/RecycleEmAll',
  },
  {
    id: 'd2',
    name: 'Destiny 2',
    short: 'D2',
    status: 'rccea#1277',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.08)',
    border: 'rgba(249, 115, 22, 0.25)',
    href: 'https://www.bungie.net/7/en/User/Profile/3/4611686018519700375?bgn=rccea',
  },
]

const PLATFORMS = [
  {
    name: 'Steam',
    handle: 'Ping Ping',
    href: 'https://steamcommunity.com/profiles/76561199102075092',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.662 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/>
      </svg>
    ),
    color: '#c6d4df',
  },
  {
    name: 'Discord',
    handle: 'rccea',
    href: 'https://discord.com/users/rccea',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.013.04.029.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    color: '#5865f2',
  },
  {
    name: 'VRChat',
    handle: '萍萍<3',
    href: 'https://vrchat.com/home/user/usr_6c4355d9-6f7e-4df0-a616-4577802cd5e2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.629 0 12-5.372 12-12C24 5.373 18.629 0 12 0zm0 2c5.523 0 10 4.478 10 10s-4.477 10-10 10S2 17.522 2 12 6.477 2 12 2zm-3.5 6A3.5 3.5 0 0 0 5 11.5v1A3.5 3.5 0 0 0 8.5 16h7a3.5 3.5 0 0 0 3.5-3.5v-1A3.5 3.5 0 0 0 15.5 8h-7zm0 2h7A1.5 1.5 0 0 1 17 11.5v1a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 12.5v-1A1.5 1.5 0 0 1 8.5 10z"/>
      </svg>
    ),
    color: '#00d4ff',
  },
  {
    name: 'Bungie',
    handle: 'rccea#1277',
    href: 'https://www.bungie.net/7/en/User/Profile/3/4611686018519700375?bgn=rccea',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 3.16l6.316 3.5v2.273l-6.316 3.5-6.316-3.5V6.66zm-7.704 5.034l6.316 3.5v6.721l-1.157-.67V12.04l-5.159-2.847zm16.722 0l.659.38v5.394l-5.159 2.847v5.705l-1.157.67V11.694z"/>
      </svg>
    ),
    color: '#f97316',
  },
  {
    name: 'Roberts Space Ind.',
    handle: 'RecycleEmAll',
    href: 'https://robertsspaceindustries.com/en/citizens/RecycleEmAll',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
    color: '#6699ff',
  },
]

/* ─── Component ─────────────────────────────────────────────────── */

const Page: FC = () => {
  return (
    <main
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '720px',
        margin: '0 auto',
        padding: '80px 24px 120px',
      }}
    >
      {/* ── Hero ─────────────────────────────── */}
      <section className="fade-up" style={{ marginBottom: '72px' }}>

        {/* Online status */}
        <div
          className="fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            padding: '6px 14px',
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '20px',
          }}
        >
          <span className="status-dot" />
          <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: '#22c55e', fontWeight: 600 }}>
            ONLINE
          </span>
        </div>

        {/* Name */}
        <h1
          className="fade-up delay-1"
          style={{
            fontSize: 'clamp(52px, 10vw, 88px)',
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '8px',
          }}
        >
          PING
          <br />
          <span style={{ color: 'var(--cyan)', textShadow: '0 0 40px rgba(0,229,255,0.4)' }}>
            PING
          </span>
        </h1>

        {/* Alias row */}
        <div
          className="fade-up delay-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '20px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.05em' }}
          >
            alias
          </span>
          {['rccea', '萍萍<3', 'RecycleEmAll'].map((a) => (
            <span
              key={a}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'var(--cyan)',
                background: 'var(--cyan-dim)',
                padding: '3px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(0,229,255,0.15)',
              }}
            >
              {a}
            </span>
          ))}
          <span style={{ color: 'var(--muted)', fontSize: '13px' }}>· Melbourne, AU</span>
        </div>

        <p
          className="fade-up delay-3"
          style={{
            fontSize: '15px',
            color: 'rgba(221, 228, 240, 0.65)',
            lineHeight: 1.7,
            maxWidth: '480px',
          }}
        >
          Worst at English, Worstest at Japanese.
        </p>
      </section>

      <hr className="divider fade-up delay-3" style={{ marginBottom: '64px' }} />

      {/* ── Games ────────────────────────────── */}
      <section style={{ marginBottom: '72px' }}>
        <p className="section-label fade-up delay-3" style={{ marginBottom: '24px' }}>
          Currently playing
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          {GAMES.map((g, i) => (
            <GameCard key={g.id} game={g} delay={i + 4} />
          ))}
        </div>
      </section>

      <hr className="divider fade-up" style={{ marginBottom: '64px' }} />

      {/* ── Platforms ────────────────────────── */}
      <section>
        <p className="section-label fade-up" style={{ marginBottom: '24px' }}>
          Find me on
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PLATFORMS.map((p, i) => (
            <PlatformLink key={p.name} platform={p} delay={i + 4} />
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer
        className="fade-up"
        style={{
          marginTop: '80px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--muted)',
          letterSpacing: '0.05em',
        }}
      >
        k41.au · built by Ping Ping
      </footer>
    </main>
  )
}

/* ─── Sub-components ────────────────────────────────────────────── */

function GameCard({ game, delay }: { game: typeof GAMES[0]; delay: number }) {
  const inner = (
    <div
      className={`fade-up delay-${delay}`}
      style={{
        padding: '20px 18px',
        background: game.bg,
        border: `1px solid ${game.border}`,
        borderRadius: '12px',
        transition: 'all 0.25s ease',
        cursor: game.href ? 'pointer' : 'default',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = `0 0 28px ${game.border}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          fontSize: '22px',
          fontWeight: 800,
          color: game.color,
          marginBottom: '10px',
          letterSpacing: '-0.02em',
        }}
      >
        {game.short}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
        {game.name}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.03em' }}>
        {game.status}
      </div>
    </div>
  )

  return game.href ? (
    <a href={game.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      {inner}
    </a>
  ) : (
    inner
  )
}

function PlatformLink({ platform, delay }: { platform: typeof PLATFORMS[0]; delay: number }) {
  return (
    <a
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`platform-btn fade-up delay-${delay}`}
    >
      <span style={{ color: platform.color, flexShrink: 0 }}>{platform.icon}</span>
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>
          {platform.name}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
          {platform.handle}
        </div>
      </div>
      <span style={{ color: 'var(--muted)', fontSize: '16px', position: 'relative', zIndex: 1 }}>
        ↗
      </span>
    </a>
  )
}

export default Page
# k41.au — Personal Gaming Contact Page

> Built with [Claude Code](https://claude.ai/code) · Deployed on [Vercel](https://vercel.com) · Live at [k41.au](https://k41.au)

A personal gaming contact page and profile hub for **Ping Ping** (rccea / GrandePingus / 萍萍<3), showcasing active games, screenshots, social links and a community guestbook.

---

## ✦ Features

- **Live Discord status** via [Lanyard API](https://github.com/Phineas/lanyard) — online/idle/dnd/offline with last seen
- **Spotify Now Playing** — live track display with animated music bars
- **FFXIV Character Card** — pulls live data from xivapi (Grande Pingus, Kujata)
- **Steam Recently Played** — last 3 games with playtime via Steam Web API
- **Screenshot Gallery** — auto-detects any image in `/public/screenshots/`, paginated at 6 with lightbox
- **Splash art hover** — custom photography reveals on game card hover
- **Guestbook** — Discord OAuth sign-in required, messages stored in Supabase
- **Visitor counter** — live page visit count
- **Spotify sidebar player** — collapsible slide-out playlist on left sidebar
- **Section navigation** — right-side dot nav with scroll progress bar, both fully responsive
- **earth.io Discord invite** — sidebar link to Discord community server
- **Raining game icons** — ambient FFXIV / VRChat / Destiny 2 / Star Citizen icon rain
- **Cursor trail** — neon particle trail following the mouse
- **Dark / Warm mode** — cold neon dark mode + amber candlelight warm mode, both fully theme-aware including canvas animations
- **Multilanguage** — EN · 日本語 · 繁體中文 · 简体中文 · 한국어
- **Fully mobile responsive** — sidebars scale down on tablet, hidden on mobile

---

## ✦ Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS |
| Font | [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) |
| Database | [Supabase](https://supabase.com) (Postgres + Auth) |
| Auth | Discord OAuth via Supabase Auth |
| Hosting | [Vercel](https://vercel.com) |
| Domain | [Porkbun](https://porkbun.com) — k41.au |
| AI | Built with [Claude Code](https://claude.ai/code) by Anthropic |

---

## ✦ Built with Claude Code

This project was developed in collaboration with **[Claude](https://claude.ai/code)**, Anthropic's AI coding assistant, as an experiment in AI-assisted development.

The workflow combined personal direction, design taste, and technical decisions with Claude's ability to rapidly generate and iterate on code — covering everything from Next.js components and API routes to CSS animations and deployment config.

> *"Worst at English, Worstest at Japanese. Part-time Warrior of Light, full-time vibe coder."*

---

## ✦ Project Structure

```
k41-portfolio/
├── app/
│   ├── api/
│   │   ├── guestbook/route.ts   # Supabase guestbook API (Discord auth)
│   │   ├── screenshots/route.ts # Auto-detect screenshots
│   │   └── steam/route.ts       # Steam recently played
│   ├── lib/
│   │   └── supabase.ts          # Supabase client
│   ├── globals.css              # Animations, themes, responsive layout
│   ├── layout.tsx               # Root layout + font
│   ├── page.tsx                 # Main page (all features)
│   └── translations.ts          # 5-language support
├── public/
│   ├── icons/                   # Platform icons
│   ├── screenshots/             # In-game screenshots (auto-loaded)
│   └── splash/                  # Game card hover art
└── .env.local                   # API keys (not committed)
```

---

<p align="center">
  <sub>k41.au · built by Ping Ping · powered by Claude Code</sub>
</p>
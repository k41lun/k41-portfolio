import type { Metadata } from 'next'
import { Oxanium } from 'next/font/google'
import './globals.css'

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ping Ping — rccea',
  description: 'Gaming contact page — FFXIV · VRChat · Star Citizen · Destiny 2',
  openGraph: {
    title: 'Ping Ping — rccea',
    description: 'Find me in FFXIV, VRChat, Star Citizen & Destiny 2',
    url: 'https://k41.au',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={oxanium.variable}>
      <body>{children}</body>
    </html>
  )
}

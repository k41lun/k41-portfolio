import type { Metadata } from 'next'
import { Chakra_Petch } from 'next/font/google'
import './globals.css'

const chakra = Chakra_Petch({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ping Ping — rccea',
  description: 'Gaming contact page — FFXIV · VRChat · Star Citizen · Destiny 2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={chakra.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
// Externals
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
// Locals
import './globals.css'
import { BessiSkillScoresContextComponent } from '@/contexts/BessiSkillScoresContext'


const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <BessiSkillScoresContextComponent>
          {children}
        </BessiSkillScoresContextComponent>
        <SpeedInsights />
      </body>
    </html>
  )
}

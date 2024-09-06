'use client'

// Externals
// import * as Castle from '@castleio/castle-js'
import { UserProvider } from '@auth0/nextjs-auth0/client'
// Locals
import Header from '@/components/Header'
import ProgressBar from '@/components/Progress/ProgressBar'
import UserDemographicsLayout from '@/components/Layouts/UserDemographics'
import BessiSkillScoresLayout from '@/components/Layouts/BessiSkillScoresLayout'
// Contexts
import { GameSessionProvider } from '@/contexts/GameSessionContext'
// Types
// CSS
import './globals.css'




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang='en'>
        <body>
          <ProgressBar>
            <UserProvider>
              <UserDemographicsLayout>
                <BessiSkillScoresLayout>
                  <GameSessionProvider>
                    <Header />
                    { children }
                  </GameSessionProvider>
                </BessiSkillScoresLayout>
              </UserDemographicsLayout>
            </UserProvider>
          </ProgressBar>
        </body>
      </html>
    </>
  )
}

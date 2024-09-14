'use client'

// Externals
// import * as Castle from '@castleio/castle-js'
import { useContext } from 'react'
// import { UserProvider } from '@auth0/nextjs-auth0/client'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import ProgressBar from '@/components/Progress/ProgressBar'
import SessionLayout from '@/components/Layouts/SessionLayout'
import GameSessionLayout from '@/components/Layouts/GameSessionLayout'
import BessiSkillScoresLayout from '@/components/Layouts/BessiSkillScoresLayout'
import UserDemographicsLayout from '@/components/Layouts/UserDemographicsLayout'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// CSS
import Header from '@/components/Header'
import { definitelyCenteredStyle } from '@/theme/styles'
import './globals.css'




// --------------------------- Function component ------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Contexts
  const {
    isFetchingSession
  } = useContext<SessionContextType>(SessionContext)



  return (
    <>
      { isFetchingSession ? (
        <>
          <html lang='en'>
            <body>
              <div
                style={ {
                  ...definitelyCenteredStyle,
                  position: 'relative',
                  top: '80px',
                } }
              >
                <Spinner height='40' width='40' />
              </div>
            </body>
          </html>
        </>
      ) : (
        <>
          <html lang='en'>
            <body>
              <ProgressBar>
                {/* <UserProvider> */ }
                <SessionLayout>
                  <GameSessionLayout>
                    <UserDemographicsLayout>
                      <BessiSkillScoresLayout>
                        <Header />
                        { !isFetchingSession && children }
                      </BessiSkillScoresLayout>
                    </UserDemographicsLayout>
                  </GameSessionLayout>
                </SessionLayout>
                {/* </UserProvider> */ }
              </ProgressBar>
            </body>
          </html>
        </>
      ) }
    </>
  )
}

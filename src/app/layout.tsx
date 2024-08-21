'use client'

// Externals
import * as Castle from '@castleio/castle-js'
import { UserProvider } from '@auth0/nextjs-auth0/client'
// Locals
import Header from '@/components/Header'
import Spinner from '@/components/Suspense/Spinner'
import ProgressBar from '@/components/Progress/ProgressBar'
import BessiSkillScoresLayout from '@/components/Layouts/BessiSkillScoresLayout'
import UserDemographicsLayout from '@/components/Layouts/UserDemographics'
// Contexts
import { GameSessionProvider } from '@/contexts/GameSessionContext'
// Types
import {
  ACCOUNT__DYNAMODB,
  PARTICIPANT__DYNAMODB,
  STUDY_SIMPLE__DYNAMODB
} from '@/utils'
// CSS
import './globals.css'
import { definitelyCenteredStyle } from '@/theme/styles'



export type SessionType = { 
  email: string
  username: string 
  isAdmin: boolean
  isParticipant: boolean
  studies?: STUDY_SIMPLE__DYNAMODB[] // `undefined` for a non-participant
}


export type SessionResponse = {
  session: SessionType | null
  error: Error | null
}


const INIT_USER = {
  email: '',
  username: '',
  isAdmin: false,
}




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

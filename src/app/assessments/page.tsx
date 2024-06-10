'use client'

// Externals
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import LeftHandNav from '@/components/Nav/LeftHand'
// Sections
import PersonalityAssessments from '@/sections/assessments'
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'


export default function _() {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { isFetchingAccount } = useAccount()
  

  return (
    <>
      <main>
        { isLoading || isFetchingAccount ? (
          <>
            <div
              style={ {
                ...definitelyCenteredStyle,
                position: 'relative',
                top: '100px',
              } }
            >
              <Spinner height='40' width='40' />
            </div>
          </>
        ) : (
          <>
            <LeftHandNav>
              <PersonalityAssessments />
            </LeftHandNav>
          </>
        )}
      </main>
    </>
  )
}
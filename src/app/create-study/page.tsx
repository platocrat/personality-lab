'use client'

// Externals
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import LeftHandNav from '@/components/Nav/LeftHand'
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Sections
import CreateStudy from '@/sections/main-portal/studies/create'
// Hooks
import useAccount from '@/hooks/useAccount'


const PAGE_FRAGMENT_ID = 'create-study'



export default function _() {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { isFetchingAccount } = useAccount()


  return (
    <>
      <main>
        <NetworkRequestSuspense
          isLoading={ isLoading || isFetchingAccount }
          spinnerOptions={{ 
            showSpinner: true,
            containerStyle: {
              top: '100px',
            }
          }}
        >
          <LeftHandNav>
            <CreateStudy />
          </LeftHandNav>
        </NetworkRequestSuspense>
      </main>
    </>
  )
}
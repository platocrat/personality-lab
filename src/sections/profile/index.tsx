'use client'

// Externals
import { FC } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Hooks
import useAccount from '@/hooks/useAccount'


type ProfileProps = {

}


const Profile: FC<ProfileProps> = ({

}) => {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { isFetchingAccount } = useAccount()


  return (
    <>
      <NetworkRequestSuspense
        isLoading={ isLoading && !user && isFetchingAccount }
        spinnerOptions={{
          showSpinner: true
        }}
      >
        <div>

        </div>
      </NetworkRequestSuspense>
    </>
  )
}


export default Profile
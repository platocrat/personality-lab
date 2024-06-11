'use client'

// Externals
import { FC } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Sections
import HistoricalAssessments from '@/sections/profile/historical-assessments'
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/app/page.module.css'


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
          showSpinner: true,
        }}
      >
        <main className={ `${styles.main}` }>
          <div>
            <h1>
              { `Profile` }
            </h1>

            { user && (
              <>
                <div>
                  <div style={ { marginBottom: '24px' } }>
                    <p>
                      { `Welcome, ${user.name}!` }
                    </p>
                  </div>
                  <HistoricalAssessments />
                </div>
              </>
            ) }

          </div>
        </main>
      </NetworkRequestSuspense>
    </>
  )
}


export default Profile
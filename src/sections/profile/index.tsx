'use client'

// Externals
import { useUser } from '@auth0/nextjs-auth0/client'
import { FC } from 'react'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
import HistoricalAssessments from '@/sections/profile/historical-assessments'
// Sections
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import appStyles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/profile/Profile.module.css'


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
        <main 
          className={ `${appStyles.main}` }
          style={{ 
          }}
        >
          <div
            style={{
              ...definitelyCenteredStyle,
              flexDirection: 'column',
            }}
          >
            <div>
              <h2>
                { `Profile` }
              </h2>
              { user && (
                <>
                  <div style={ { marginBottom: '24px' } }>
                    <p>
                      { `Welcome, ${user.name}!` }
                    </p>
                  </div>
                </>
              )}
            </div>

            { user && (
              <>
                <div
                  className={ sectionStyles['profile-content'] }
                  style={ {
                    ...definitelyCenteredStyle,
                    flexDirection: 'column',
                  } }
                >
                  <HistoricalAssessments />
                </div>
              </>
            )}

          </div>
        </main>
      </NetworkRequestSuspense>
    </>
  )
}


export default Profile
'use client'

// Externals
// import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, useContext } from 'react'
// Locals
// import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Sections
import HistoricalAssessments from '@/sections/profile/historical-assessments'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// // Hooks
// import useAccount from '@/hooks/useAccount'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/profile/Profile.module.css'


type ProfileProps = {

}



const Profile: FC<ProfileProps> = ({

}) => {
  // // Auth0
  // const { user, error, isLoading } = useUser()

  // Contexts
  const { email } = useContext<SessionContextType>(SessionContext)

  // // Hooks
  // const { isFetchingAccount } = useAccount()



  return (
    <>
      {/* <NetworkRequestSuspense
        isLoading={ isLoading && !user && isFetchingAccount }
        spinnerOptions={{
          showSpinner: true,
        }}
      > */}
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
            { email && (
              <>
                <div style={ { marginBottom: '24px' } }>
                  <p>
                    {/* { `Welcome, ${user.name}!` } */}
                    { `Welcome, ${ email }!` }
                  </p>
                </div>
              </>
            )}
          </div>

          { email && (
            <>
              <div
                className={ styles['profile-content'] }
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
      {/* </NetworkRequestSuspense> */}
    </>
  )
}


export default Profile
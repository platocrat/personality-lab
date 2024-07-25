'use client'

// Externals
import { FC } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import FictionalCharacters from './fictional-characters'



type SocialRatingProps = {
  
}




const SocialRating: FC<SocialRatingProps> = ({

}) => {
  // Auth0
  const { user, error, isLoading } = useUser()
  // Hooks
  const { isFetchingAccount } = useAccount()



  return (
    <>
      <NetworkRequestSuspense
        isLoading={ isLoading && !user && isFetchingAccount }
        spinnerOptions={ {
          showSpinner: true,
        } }
      >
        <main
          className={ `${styles.main}` }
          style={ {
          } }
        >
          <div style={{ ...definitelyCenteredStyle, flexDirection: 'column' } }>
            <div>
              { `Social rating stuff goes here` }
            </div>

            <FictionalCharacters />
          </div>
        </main>
      </NetworkRequestSuspense>
    </>
  )
}


export default SocialRating
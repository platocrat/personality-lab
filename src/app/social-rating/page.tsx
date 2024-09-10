// Externals
// import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import SocialRating from '@/sections/social-rating'
// import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// // Hooks
// import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'





export default function _() {
  // // Auth0
  // const { user, error, isLoading } = useUser()
  // // Hooks
  // const { isFetchingAccount } = useAccount()



  return (
    <>
      {/* <NetworkRequestSuspense
        isLoading={ isLoading && !user && isFetchingAccount }
        spinnerOptions={ {
          showSpinner: true,
        } }
      > */}
      <main className={ `${styles.main}` }>
        <SocialRating />
      </main>
      {/* </NetworkRequestSuspense> */ }
    </>
  )
}
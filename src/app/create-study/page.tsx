'use client'
// Externals
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import LeftHandNav from '@/components/Nav/LeftHand'
// Sections
import CreateStudy from '@/sections/main-portal/studies/create'
// Hooks
import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/app/page.module.css'


const PAGE_FRAGMENT_ID = 'create-study'



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
          </>
        ) : (
          <>
            <LeftHandNav>
              <CreateStudy />
            </LeftHandNav>
          </>
        )}
      </main>
    </>
  )
}
'use client'

import { definitelyCenteredStyle } from '@/theme/styles'
// Externals
import { FC } from 'react'
// import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
// import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// // Hooks
// import useAccount from '@/hooks/useAccount'


type SettingsProps = {

}


const Settings: FC<SettingsProps> = ({

}) => {
  // // Auth0
  // const { user, error, isLoading } = useUser()
  // // Hooks
  // const { isFetchingAccount } = useAccount()


  return (
    <>
      {/* <NetworkRequestSuspense
        isLoading={ isLoading && !user && isFetchingAccount }
        spinnerOptions={ {
          showSpinner: true
        } }
      > */}
        <div>
          <div 
            style={{ 
                ...definitelyCenteredStyle,
                position: 'relative',
                top: '90px', 
              }}
          >
            <h4>{ `Toggle on/off experimental features here` }</h4>
          </div>
        </div>
      {/* </NetworkRequestSuspense> */}
    </>
  )
}


export default Settings
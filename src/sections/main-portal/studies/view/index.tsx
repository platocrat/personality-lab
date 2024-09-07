'use client'

// Externals
// import { useUser } from '@auth0/nextjs-auth0/client'
import { FC } from 'react'
// Locals
import ListOfStudies from './list-of-studies'
import ViewStudiesTitle from './title'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// // Hooks
// import useAccount from '@/hooks/useAccount'
// CSS
import styles from '@/sections/main-portal/studies/view/ViewStudies.module.css'


type ViewStudiesProps = {
}


const ViewStudies: FC<ViewStudiesProps> = ({

}) => {
  // // Auth0
  // const { isLoading } = useUser()
  // // Hooks
  // const {
  //   isFetchingAccount,
  // } = useAccount()


  return (
    <>
      {/* <NetworkRequestSuspense
        isLoading={ isLoading || isFetchingAccount }
        spinnerOptions={{
          showSpinner: true,
          containerStyle: {
            top: '100px'
          }
        }}
      > */}
        <LeftHandNav>
          <div className={ `${styles['form-container']}` }>
            <ViewStudiesTitle />
            <ListOfStudies />
          </div>
        </LeftHandNav>
      {/* </NetworkRequestSuspense> */}
    </>
  )
}


export default ViewStudies
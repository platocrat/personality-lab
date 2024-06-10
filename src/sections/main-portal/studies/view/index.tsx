'use client'

// Externals
import { FC } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import useAccount from '@/hooks/useAccount'
import Spinner from '@/components/Suspense/Spinner'
// Sections
import ViewStudiesTitle from './title'
import ListOfStudies from './list-of-studies'
// Components
import LeftHandNav from '@/components/Nav/LeftHand'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/main-portal/studies/view/ViewStudies.module.css'


type ViewStudiesProps = {
}


const ViewStudies: FC<ViewStudiesProps> = ({

}) => {
  // Auth0
  const { isLoading } = useUser()
  // Hooks
  const {
    isFetchingAccount,
  } = useAccount()


  return (
    <>
      { isLoading || isFetchingAccount ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '100px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
          <LeftHandNav>
            <div className={ `${styles['form-container']}` }>
              <ViewStudiesTitle />
              <ListOfStudies />
            </div>
          </LeftHandNav>
        </>
      )}
    </>
  )
}


export default ViewStudies
'use client'

// Externals
// import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
import ViewStudySection from '@/sections/main-portal/studies/view/study'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context Type
import { SessionContextType } from '@/contexts/types'
// Components
// Utils
import { STUDY__DYNAMODB } from '@/utils'



type ViewStudyProps = {
  params: {
    id: string // Study ID
  }
}



const ViewStudy: FC<ViewStudyProps> = ({
  params
}) => {
  // // Auth0
  // const { user, error, isLoading } = useUser()

  // Contexts
  const { email } = useContext<SessionContextType>(SessionContext)

  // URL params
  const { id } = params
  // States
  const [ isLoadingStudy, setIsLoadingStudy ] = useState(false)
  const [ study, setStudy ] = useState<STUDY__DYNAMODB | undefined>(undefined)


  // --------------------------- Async functions -------------------------------
  async function getStudy() {
    try {
      const apiEndpoint = `/api/v1/study?email=${ email }id=${ id }`
      const response = await fetch(apiEndpoint, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      setStudy(json.study)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    if (!id) {
      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error: 'id' is invalid , see ${id}`)
    } else {
      // if (!isLoading && user && user.email) {
      if (email) {
        setIsLoadingStudy(true)

        const requests = [
          getStudy()
        ]

        Promise.all(requests).then((response: any) => {
          setIsLoadingStudy(false)
        })
      // } else if (!isLoading && !user) {
      } else {
        // // Silently log the error to the browser's console
        // console.error(
        //   `Auth0 couldn't get 'user' from useUser(): `,
        //   error
        // )
        
        console.error(`Couldn't get the user's email`)
      }
    }
  }, [ id, /* isLoading */, email ])


  return (
    <>
      <NetworkRequestSuspense
        isLoading={ isLoadingStudy }
        spinnerOptions={{
          showSpinner: true,
          containerStyle: {
            top: ''
          }
        }}
      >
        <ViewStudySection study={ study } />
      </NetworkRequestSuspense>
    </>
  )
}

export default ViewStudy

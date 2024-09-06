'use client'

// Externals
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import StudyInviteSection from '@/sections/invite'
// Components
// Hooks
import useAccount from '@/hooks/useAccount'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'




type StudyInviteProps = {
  params: {
    id: string // Study ID
  }
}



const StudyInvite: FC<StudyInviteProps> = ({
  params
}) => {
  // URL params
  const { id } = params
  // Auth0
  const { user, error, isLoading } = useUser()
  // Contexts
  const { 
    isGlobalAdmin,
    isParticipant,
    isFetchingAccount,
  } = useAccount()
  // Hooks
  const router = useRouter()
  // States
  const [isLoadingStudy, setIsLoadingStudy] = useState(true)
  const [study, setStudy] = useState<STUDY__DYNAMODB | null>(null)


  // --------------------------- Async functions -------------------------------
  async function getStudy() {
    try {
      const response = await fetch(`/api/invite?id=${id}`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      if (!json.study) {
        router.push('/')
      } else {
        setStudy(json.study)
        setIsLoadingStudy(false)
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    if (!isFetchingAccount) {
      if (
        isGlobalAdmin || 
        (!isGlobalAdmin && isParticipant)
      ) {
        router.push('/')
      } else {
        if (!id) {
          /**
           * @todo Replace the line below by handling the error on the UI here
           */
          throw new Error(`Error: 'id' is invalid , see ${id}`)
        } else {
          console.log(`Unregistered user detected! Fetching study for ID '${id}'...`)
          const requests = [
            getStudy()
          ]

          Promise.all(requests).then((response: any) => {})
        }
      }
    }
  }, [ isGlobalAdmin, isParticipant, isFetchingAccount ])




  return (
    <>
      <NetworkRequestSuspense
        isLoading={ isLoadingStudy }
        spinnerOptions={{
          showSpinner: true,
          containerStyle: {
            top: !isGlobalAdmin && !isParticipant ? '100px' : ''
          }
        }}
      >
        <StudyInviteSection study={ study } />
      </NetworkRequestSuspense>
    </>
  )
}


export default StudyInvite

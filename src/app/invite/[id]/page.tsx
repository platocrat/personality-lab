'use client'

// Externals
import { useRouter } from 'next/navigation'
import { FC, useContext, useLayoutEffect, useState } from 'react'
// Locals
import StudyInviteSection from '@/sections/invite'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
// Context types
import { SessionContextType } from '@/contexts/types'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



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
  // Contexts
  const { 
    isAdmin, 
    isParticipant 
  } = useContext<SessionContextType>(SessionContext)
  // Hooks
  const router = useRouter()
  // States
  const [isLoadingStudy, setIsLoadingStudy] = useState(false)
  const [study, setStudy] = useState<STUDY__DYNAMODB | null>(null)


  // --------------------------- Async functions -------------------------------
  async function getStudy() {
    try {
      const response = await fetch(`/api/study?id=${id}`, {
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
    setIsLoadingStudy(true)

    if (
      isAdmin || 
      (!isAdmin && isParticipant)
    ) {
      router.push('/')
    } else {
      if (!id) {
        /**
         * @todo Replace the line below by handling the error on the UI here
         */
        throw new Error(`Error: 'id' is invalid , see ${id}`)
      } else {
        const requests = [
          getStudy()
        ]

        Promise.all(requests).then((response: any) => {})
      }
    }
  }, [ isAdmin, isParticipant, id, ])




  return (
    <>
      { isLoadingStudy ? (
        <>
          <div
            style={{
              ...definitelyCenteredStyle,
              position: 'relative',
              top: !isAdmin && !isParticipant ? '80px' : '',
            }}
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
          <StudyInviteSection study={ study } />
        </>
      ) }
    </>
  )
}


export default StudyInvite

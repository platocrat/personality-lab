'use client'

// Externals
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import StudyInviteSection from '@/sections/invite'
// Components
import Spinner from '@/components/Suspense/Spinner'
// UTils
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

      setStudy(json.study)
      setIsLoadingStudy(false)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    if (!id) {
      setIsLoadingStudy(true)

      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error: 'id' is invalid , see ${id}`)
    } else {
      const requests = [
        getStudy()
      ]

      Promise.all(requests)
    }
  }, [id])




  return (
    <>
      { isLoadingStudy ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
            } }
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

'use client'

// Externals
import { FC, useLayoutEffect, useState } from 'react'
// Locals
import ViewStudySection from '@/sections/admin-portal/studies/view/study'
// Components
import Spinner from '@/components/Suspense/Spinner'
// UTils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type ViewStudyProps = {
  params: {
    id: string // Study ID
  }
}



const ViewStudy: FC<ViewStudyProps> = ({
  params
}) => {
  // URL params
  const { id } = params
  // States
  const [ isDataLoading, setIsDataLoading ] = useState(false)
  const [ isLoadingStudy, setIsLoadingStudy ] = useState(false)
  const [ study, setStudy ] = useState<STUDY__DYNAMODB | null>(null)


  // --------------------------- Async functions -------------------------------
  async function getUserResults() {
    try {
      const response = await fetch(`/api/study?id=${ id }`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      console.log(`json: `, json)

      setStudy(json.study)
      setIsLoadingStudy(false)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    if (!id) {
      setIsDataLoading(true)

      /**
       * @todo Replace the line below by handling the error on the UI here
       */
      throw new Error(`Error: 'id' is invalid , see ${id}`)
    } else {
      const requests = [
        getUserResults()
      ]

      Promise.all(requests)
    }
  }, [ id ])




  return (
    <>
      { isDataLoading ? (
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
          <ViewStudySection />
        </>
      ) }
    </>
  )
}


export default ViewStudy

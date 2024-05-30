'use client'

// Externals
import {
  FC,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import StudiesTable from './table'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Hooks
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type ListOfStudiesProps = {

}




const ListOfStudies: FC<ListOfStudiesProps> = ({

}) => {
  // Contexts
  const { email } = useContext(AuthenticatedUserContext)
  // States
  const [ 
    isLoadingStudies, 
    setIsLoadingStudies 
  ] = useState<boolean>(false)
  const [ studies, setStudies ] = useState<STUDY__DYNAMODB[] | []>([])


  // -------------------------- Async functions --------------------------------
  async function getStudies() {
    setIsLoadingStudies(true)

    try {
      const response = await fetch(`/api/study?adminEmail=${ email }`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      setStudies(json.studies)
      setIsLoadingStudies(false)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  useLayoutEffect(() => {
    const requests = [
      getStudies(),
    ]

    Promise.all(requests)
  }, [ email ])




  return (
    <>
      { isLoadingStudies ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              margin: '24px 0px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
            <div 
              style={{
                position: 'relative',
                width: '100%',
                margin: '24px 0',
                // overflow: 'auto',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              { studies ? <StudiesTable studies={ studies } /> : (
                <>
                  <div style={{ ...definitelyCenteredStyle }}>
                    <p>
                      <strong>
                        { `No studies were found.` }
                      </strong>
                    </p>
                  </div>
                </>
              ) }
            </div>
        </>
      ) }
    </>
  )
}


export default ListOfStudies
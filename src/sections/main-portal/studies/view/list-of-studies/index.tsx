'use client'

// Externals
import {
  FC,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  } from 'react'
// import { useUser } from '@auth0/nextjs-auth0/client'
// Locals
import StudiesTable from './table'
// Components
import EditStudyModal from '@/components/Modals/EditStudy'
import NetworkRequestSuspense from '@/components/Suspense/NetworkRequest'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { EditStudyModalContext } from '@/contexts/EditStudyModalContext'
// Context Types
import { SessionContextType } from '@/contexts/types'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import ViewStudiesTitle from '../title'



type ListOfStudiesProps = {

}






const ListOfStudies: FC<ListOfStudiesProps> = ({

}) => {
  // Refs
  const editStudyModalRef = useRef<any>(null)

  // Contexts
  const {
    email,
    accountError,
  } = useContext<SessionContextType>(SessionContext)

  // // Hooks
  // const { user, error, isLoading } = useUser()

  // States
  const [ 
    isLoadingStudies, 
    setIsLoadingStudies 
  ] = useState<boolean>(true)
  const [ 
    isDeletingStudy, 
    setIsDeletingStudy 
  ] = useState<boolean>(false)
  const [ 
    isStudyDeleted, 
    setIsStudyDeleted 
  ] = useState<boolean>(false)
  const [
    showEditStudyModal,
    setShowEditStudyModal
  ] = useState<string | null>(null)
  const [ 
    studyToEdit, 
    setStudyToEdit 
  ] = useState<STUDY__DYNAMODB | null>(null)
  const [ studies, setStudies ] = useState<STUDY__DYNAMODB[] | []>([])




  function handleOpenEditStudyModal(e: any, study: STUDY__DYNAMODB) {
    setStudyToEdit(study)
    setShowEditStudyModal(study.id)
  }

  // -------------------------- Async functions --------------------------------
  async function getStudies() {
    setIsLoadingStudies(true)

    try {
      const apiEndpoint = `/api/v1/study?email=${ email }`
      const response = await fetch(apiEndpoint, { method: 'GET' })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      setStudies(json.studies)
      setIsLoadingStudies(false)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  // --------------------------------- Hooks -----------------------------------
  useClickOutside(
    editStudyModalRef,
    () => {
      console.log(`Clicked outside of EditStudyModal!`)
      return setShowEditStudyModal(null)
    }
  ) 

  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    // if (!isLoading && user && user.email) {
    if (email) {
      const requests = [
        getStudies(),
      ]
    
      Promise.all(requests)
    // } else if (!isLoading && !user) {
    } else {
      // console.error(
      //   `Auth0 couldn't get 'user' from useUser(): `,
      //   error
      // )

      console.error(`Couldn't get the user's email`)
    }
  }, [ /* isLoading */ email, isStudyDeleted ])




  return (
    <>
      <NetworkRequestSuspense
        isLoading={ /* isLoading */ !email || isLoadingStudies || isDeletingStudy }
        spinnerOptions={{
          showSpinner: true,
          containerStyle: {
            // `top: '0px'` is required to overwrite the default '80px' that 
            // positions the spinner out of bounds of the parent container
            top: '-10px',
            margin: '24px 0px',
          }
        }}
      >
        <ViewStudiesTitle />
        <EditStudyModalContext.Provider
          value={ {
            showEditStudyModal,
            setShowEditStudyModal,
            handleOpenEditStudyModal,
          } }
        >
          <div
            style={ {
              position: 'relative',
              width: '100%',
              margin: '24px 0',
              // overflow: 'auto',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            } }
          >
            { studies ? (
              <>
                <StudiesTable
                  studies={ studies }
                  state={ {
                    isStudyDeleted,
                    isDeletingStudy,
                    setIsStudyDeleted,
                    setIsDeletingStudy
                  } }
                />
              </>
            )
              : (
                <>
                  <div style={ { ...definitelyCenteredStyle } }>
                    <p>
                      <strong>
                        { `No studies were found.` }
                      </strong>
                    </p>
                  </div>
                </>
              )
            }
          </div>

          {/* Edit study modal */ }
          <EditStudyModal
            study={ studyToEdit }
            ref={ editStudyModalRef }
            setStudy={ setStudyToEdit }
            isModalVisible={ showEditStudyModal }
          />
        </EditStudyModalContext.Provider>
      </NetworkRequestSuspense>
    </>
  )
}


export default ListOfStudies
'use client'

// Externals
import {
  FC,
  useRef,
  Dispatch,
  useState,
  useContext,
  createContext,
  useLayoutEffect,
  SetStateAction,
} from 'react'
// Locals
import StudiesTable from './table'
// Components
import Spinner from '@/components/Suspense/Spinner'
import EditStudyModal from '@/components/Modals/EditStudy'
// Contexts
import { SessionContext } from '@/contexts/SessionContext'
import { EditStudyModalContext } from '@/contexts/EditStudyModalContext'
// Context types
import { SessionContextType } from '@/contexts/types'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type ListOfStudiesProps = {

}






const ListOfStudies: FC<ListOfStudiesProps> = ({

}) => {
  // Refs
  const editStudyModalRef = useRef<any>(null)
  // Contexts
  const { email } = useContext<SessionContextType>(SessionContext)
  // States
  const [ 
    isLoadingStudies, 
    setIsLoadingStudies 
  ] = useState<boolean>(false)
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


  // --------------------------------- Hooks -----------------------------------
  useClickOutside(
    editStudyModalRef,
    () => setShowEditStudyModal(null)
  ) 

  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    const requests = [
      getStudies(),
    ]

    Promise.all(requests)
  }, [ email, isStudyDeleted ])




  return (
    <>
      { isLoadingStudies || isDeletingStudy ? (
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
          <EditStudyModalContext.Provider
            value={ {
              showEditStudyModal,
              setShowEditStudyModal,
              handleOpenEditStudyModal,
            } }
          >
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
              { studies 
                ? (
                  <>
                    <StudiesTable 
                      studies={ studies }
                      state={{
                        isStudyDeleted,
                        isDeletingStudy,
                        setIsStudyDeleted,
                        setIsDeletingStudy
                      }}
                    />
                  </>
                )
                : (
                  <>
                    <div style={{ ...definitelyCenteredStyle }}>
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

            {/* Edit study modal */}
            <EditStudyModal
              study={ studyToEdit }
              ref={ editStudyModalRef }
              setStudy={ setStudyToEdit }
              isModalVisible={ showEditStudyModal }
            />
          </EditStudyModalContext.Provider>
        </>
      ) }
    </>
  )
}


export default ListOfStudies
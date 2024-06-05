// Externals
import Image from 'next/image'
import { 
  FC, 
  useRef, 
  useState,
  Fragment, 
  Dispatch, 
  SetStateAction, 
} from 'react'
// Locals
// Sections
import StudyTableTbody from '@/sections/main-portal/studies/view/list-of-studies/table/tbody'
// Components
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import sectionStyles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'



type StudiesTableProps = {
  studies: STUDY__DYNAMODB[] | []
  state: {
    isStudyDeleted: boolean
    isDeletingStudy: boolean
    showEditStudyModal: boolean
    setIsStudyDeleted: Dispatch<SetStateAction<boolean>>
    setIsDeletingStudy: Dispatch<SetStateAction<boolean>>
    setShowEditStudyModal: Dispatch<SetStateAction<boolean>>
  }
}


const TABLE_HEADERS = [
  `Name`,
  `Status`,
  `Created`,
  `Admin Emails`,
]




const StudiesTable: FC<StudiesTableProps> = ({
  state,
  studies,
}) => {
  // Refs
  const editStudyModalRef = useRef<any>(null)
  const studyActionsDropdownRef = useRef<any>(null)
  // Hooks
  const windowWidth = useWindowWidth()
  // States
  const [
    isDropdownVisible,
    setIsDropdownVisible
  ] = useState<string | null>(null)

  
  const fullWidthTd = windowWidth <= 920 ? '100%' : ''
  const buttonHref = (studyId: string): string => `/view-studies/study/${studyId}`

  // ----------------------------- Regular functions ---------------------------
  // ~~~~~~ Button handlers ~~~~~~
  const toggleDropdown = (studyId: string) => {
    if (isDropdownVisible === studyId) {
      setIsDropdownVisible(null)
    } else {
      setIsDropdownVisible(studyId)
    }
  }


  function handleOpenEditStudyModal(e: any, study: STUDY__DYNAMODB) {
    state.setShowEditStudyModal(true)
  }


  // ----------------------------- Async functions -----------------------------
  async function handleDeleteStudy(
    e: any,
    studyId: string,
    ownerEmail: string,
    createdAtTimestamp: number
  ) {
    state.setIsDeletingStudy(true)
    state.setIsStudyDeleted(false)

    try {
      const response = await fetch('/api/study', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ownerEmail, 
          studyId,
          createdAtTimestamp,
        }),
      })

      const json = await response.json()

      if (response.status === 400) throw new Error(json.error)
      if (response.status === 404) throw new Error(json.message)
      if (response.status === 405) throw new Error(json.error)
      if (response.status === 500) throw new Error(json.error)

      console.log(
        `[${new Date().toLocaleString()} --filepath="src/app/layout.tsx" --function="handleDeleteStudy()"]: json: `,
        json
      )

      const successMessage = json.message
      state.setIsDeletingStudy(false)
      state.setIsStudyDeleted(true)
    } catch (error: any) {
      state.setIsDeletingStudy(false)
      state.setIsStudyDeleted(false)
      throw new Error(error)
    }
  }
  

  // --------------------------------- Hooks -----------------------------------
  useClickOutside(
    studyActionsDropdownRef,
    () => setIsDropdownVisible(null)
  )


  const buttonHandlers = {
    buttonHref,
    toggleDropdown,
    handleDeleteStudy,
    handleOpenEditStudyModal,
  }





  return (
    <>
      <table className={ sectionStyles.table }>
        <thead>
          <tr>
            { TABLE_HEADERS.map((name: string, i: number) => (
              <Fragment key={ i }>
                <th>{ name }</th>
              </Fragment>
            )) }
          </tr>
        </thead>
        <StudyTableTbody 
          studies={ studies }
          fullWidthTd={ fullWidthTd }
          buttonHandlers={ buttonHandlers }
          isDropdownVisible={ isDropdownVisible }
          studyActionsDropdownRef={ studyActionsDropdownRef }
        />
      </table>
    </>
  )
}


export default StudiesTable
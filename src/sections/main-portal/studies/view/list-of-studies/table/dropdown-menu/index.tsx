// Externals
import { FC } from 'react'
// Locals
// Components
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Sections
import study from '@/sections/main-portal/studies/view/study'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import sectionStyles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'




type StudyDropdownMenuProps = {
  study: STUDY__DYNAMODB
  isDropdownVisible: string | null
  studyActionsDropdownRef: any
  buttonHandlers: {
    buttonHref: (studyId: string) => string
    handleOpenEditStudyModal: (e: any, study: STUDY__DYNAMODB) => void
    handleDeleteStudy: (
      e: any,
      id: string,
      ownerEmail: string,
      createdAtTimestamp: number
    ) => void
  }
}



const StudyDropdownMenu: FC<StudyDropdownMenuProps> = ({
  study,
  buttonHandlers,
  isDropdownVisible,
  studyActionsDropdownRef,
}) => {
  return (
    <>
      { isDropdownVisible === study.id && (
        <div
          ref={ studyActionsDropdownRef }
          style={{ position: 'relative' }}
        >
          <div className={ sectionStyles.dropdown }>
            <ProgressBarLink  
              href={ buttonHandlers.buttonHref(study?.id.toString()) }
            >
              <button style={{ borderRadius: '4px 4px 0px 0px' }}>
                { ` View` }
              </button>
            </ProgressBarLink>
            <button
              onClick={
                (e: any) => buttonHandlers.handleOpenEditStudyModal(
                  e,
                  study,
                )
              }
            >
              { `Edit` }
            </button>
            <button
              style={{ borderRadius: '0px 0px 4px 4px' }}
              onClick={
                (e: any) => buttonHandlers.handleDeleteStudy(
                  e,
                  study.id,
                  study.ownerEmail,
                  study.createdAtTimestamp,
                )
              }
            >
              { `Delete` }
            </button>
          </div>
        </div>
      ) }
    </>
  )
}


export default StudyDropdownMenu
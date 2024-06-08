// Externals
import { FC, useContext } from 'react'
// Locals
// Components
import ProgressBarLink from '@/components/Progress/ProgressBarLink'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import sectionStyles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'
import { EditStudyModalContext } from '@/contexts/EditStudyModalContext'
import { StudiesTableContext } from '@/contexts/StudiesTableContext'
import { EditStudyModalContextType, StudiesTableContextType } from '@/contexts/types'




type StudyDropdownMenuProps = {
  study: STUDY__DYNAMODB
  isDropdownVisible: string | null
  studyActionsDropdownRef: any
}



const StudyDropdownMenu: FC<StudyDropdownMenuProps> = ({
  study,
  isDropdownVisible,
  studyActionsDropdownRef,
}) => {
  // Contexts
  const { 
    buttonHandlers 
  } = useContext<StudiesTableContextType>(StudiesTableContext)
  const { 
    handleOpenEditStudyModal 
  } = useContext<EditStudyModalContextType>(EditStudyModalContext)


  const handleDeleteClick = (e: any) => {
    let confirmDelete
    
    if (window !== undefined) {
      confirmDelete = window.confirm('Are you sure you want to delete this study?')
    }

    if (confirmDelete) {
      buttonHandlers?.handleDeleteStudy(
        e,
        study.id,
        study.ownerEmail,
        study.createdAtTimestamp,
      )
    }
  }




  return (
    <>
      { isDropdownVisible === study.id && (
        <div
          ref={ studyActionsDropdownRef }
          style={{ position: 'relative' }}
        >
          <div className={ sectionStyles.dropdown }>
            <ProgressBarLink  
              href={ buttonHandlers?.buttonHref(study?.id.toString()) ?? '' }
            >
              <button style={{ borderRadius: '4px 4px 0px 0px' }}>
                { ` View` }
              </button>
            </ProgressBarLink>
            <button
              onClick={
                (e: any) => handleOpenEditStudyModal !== null 
                  ? handleOpenEditStudyModal(e, study)
                  : console.error('handleOpenEditStudyModal() is null')
              }
            >
              { `Edit` }
            </button>
            <button
              onClick={ handleDeleteClick }
              style={{ borderRadius: '0px 0px 4px 4px' }}
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
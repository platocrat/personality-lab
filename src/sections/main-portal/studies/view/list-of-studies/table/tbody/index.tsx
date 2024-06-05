// Externals
import Image from 'next/image'
import { FC, Fragment } from 'react'
import { definitelyCenteredStyle } from '@/theme/styles'
// Locals
// Sections
import StudyDropdownMenu from '@/sections/main-portal/studies/view/list-of-studies/table/dropdown-menu'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import sectionStyles from '@/sections/main-portal/studies/view/list-of-studies/ListOfStudies.module.css'



type StudyTableTbodyProps = {
  fullWidthTd: string
  studies: STUDY__DYNAMODB[]
  studyActionsDropdownRef: any
  isDropdownVisible: string | null
  buttonHandlers: {
    toggleDropdown: (studyId: any) => void
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




const StudyTableTbody: FC<StudyTableTbodyProps> = ({
  studies,
  fullWidthTd,
  buttonHandlers,
  isDropdownVisible,
  studyActionsDropdownRef,
}) => {
  const windowWidth = useWindowWidth()


  return (
    <>
      <tbody>
        { studies.map((study: STUDY__DYNAMODB, i: number) => (
          <Fragment key={ i }>
            <tr>
              {/* <td>{ study.id.slice(0, 6) + '...' }</td> */ }
              <td style={ { width: fullWidthTd } }>
                { study.name }
              </td>
              {/* <td>{ study.details.assessmentId }</td> */ }
              <td style={ { width: fullWidthTd } }>
                { study.isActive ? 'ACTIVE' : 'INACTIVE' }
              </td>
              <td style={ { width: fullWidthTd } }>
                { new Date(study.createdAtTimestamp).toLocaleString() }
              </td>
              <td style={ { width: fullWidthTd } }>
                { study.adminEmails?.join(', ') }
              </td>
              <td
                style={ {
                  width: windowWidth <= 920 ? '100%' : '80px',
                  position: 'relative',
                } }
              >
                <div className={ sectionStyles.buttonContainer }>
                  <div className={ sectionStyles.buttonDiv }>
                    <button
                      type='button'
                      onClick={
                        (e: any) => buttonHandlers.toggleDropdown(
                          study?.id
                        )
                      }
                    >
                      <p
                        style={ {
                          ...definitelyCenteredStyle,
                          position: 'relative',
                          marginRight: '4px',
                        } }
                      >
                        { `ACTIONS` }
                      </p>
                      <Image
                        width={ 18 }
                        height={ 18 }
                        style={ {
                          ...definitelyCenteredStyle,
                          position: 'relative',
                          // top: '3px',
                        } }
                        alt='Share icon to share data visualization'
                        src={ `/icons/svg/rounded-down-arrow.svg` }
                      />
                    </button>
                    {/* Dropdown menu */ }
                    <StudyDropdownMenu
                      study={ study }
                      isDropdownVisible={ isDropdownVisible }
                      studyActionsDropdownRef={ studyActionsDropdownRef }
                      buttonHandlers={{
                        buttonHref: buttonHandlers.buttonHref,
                        handleDeleteStudy: buttonHandlers.handleDeleteStudy,
                        handleOpenEditStudyModal: buttonHandlers.handleOpenEditStudyModal,
                      }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          </Fragment>
        )) }
      </tbody>
    </>
  )
}


export default StudyTableTbody
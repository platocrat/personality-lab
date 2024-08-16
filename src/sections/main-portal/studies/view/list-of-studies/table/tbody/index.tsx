// Externals
import Image from 'next/image'
import { FC, Fragment, useContext } from 'react'
import { definitelyCenteredStyle } from '@/theme/styles'
// Locals
import Tooltip from '@/sections/main-portal/studies/view/list-of-studies/table/tbody/tooltip'
// Sections
import StudyDropdownMenu from '@/sections/main-portal/studies/view/list-of-studies/table/dropdown-menu'
// Contexts
import { StudiesTableContext } from '@/contexts/StudiesTableContext'
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
}




const StudyTableTbody: FC<StudyTableTbodyProps> = ({
  studies,
  fullWidthTd,
  isDropdownVisible,
  studyActionsDropdownRef,
}) => {
  // Contexts
  const { buttonHandlers } = useContext(StudiesTableContext)
  // Hooks
  const windowWidth = useWindowWidth()



  return (
    <>
      <tbody>
        { studies.map((study: STUDY__DYNAMODB, i: number) => (
          <Fragment key={ i }>
            <tr>
              {/* <td>{ study.id.slice(0, 6) + '...' }</td> */ }
              <td style={ { width: fullWidthTd } }>
                <Tooltip text={ study.name }>
                  <span>{ study.name }</span>
                </Tooltip>
              </td>
              {/* <td>{ study.details.assessmentId }</td> */ }
              <td style={ { width: fullWidthTd } }>
                <Tooltip text={ study.isActive ? 'ACTIVE' : 'INACTIVE' }>
                  <span>{ study.isActive ? 'ACTIVE' : 'INACTIVE' }</span>
                </Tooltip>
              </td>
              <td style={ { width: fullWidthTd } }>
                <Tooltip text={ new Date(study.createdAtTimestamp).toLocaleString() }>
                  <span>{ new Date(study.createdAtTimestamp).toLocaleString() }</span>
                </Tooltip>
              </td>
              <td style={ { width: fullWidthTd } }>
                <Tooltip text={ study.adminEmails?.join(', ') as string }>
                  <span>{ study.adminEmails?.join(', ') }</span>
                </Tooltip>
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
                        (e: any) => buttonHandlers?.toggleDropdown(
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
                        alt='Rounded down arrow'
                        src={ `/icons/svg/rounded-down-arrow.svg` }
                      />
                    </button>
                    {/* Dropdown menu */ }
                    <StudyDropdownMenu
                      study={ study }
                      isDropdownVisible={ isDropdownVisible }
                      studyActionsDropdownRef={ studyActionsDropdownRef }
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
// Externals
import Link from 'next/link'
import Image from 'next/image'
import { FC, Fragment, useRef, useState } from 'react'
// Locals
import { STUDY__DYNAMODB } from '@/utils'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// CSS
import sectionStyles from '../ListOfStudies.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'
import useWindowWidth from '@/hooks/useWindowWidth'



type StudiesTableProps = {
  studies: STUDY__DYNAMODB[] | []
}


const TABLE_HEADERS = [
  // `ID`,
  `Name`,
  // `Assessment ID`,
  `Status`,
  `Date`,
  `Admin Emails`,
]




const StudiesTable: FC<StudiesTableProps> = ({
  studies
}) => {
  // Refs
  const studyActionsDropdownRef = useRef<any>(null)
  // Hooks
  const windowWidth = useWindowWidth()
  // States
  const [
    isDropdownVisible,
    setIsDropdownVisible
  ] = useState<string | null>(null)
  
  const isFullWidthTd = windowWidth <= 920 ? '100%' : ''
  const buttonHref = (studyId: string): string => `/view-studies/study/${studyId}`

  const toggleDropdown = (studyId: string) => {
    if (isDropdownVisible === studyId) {
      setIsDropdownVisible(null)
    } else {
      setIsDropdownVisible(studyId)
    }
  }
  

  // --------------------------------- Hooks -----------------------------------
  useClickOutside(
    studyActionsDropdownRef,
    () => setIsDropdownVisible(null)
  )



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
        <tbody>
          { studies.map((study: STUDY__DYNAMODB, i: number) => (
            <Fragment key={ i }>
              <tr>
                {/* <td>{ study.id.slice(0, 6) + '...' }</td> */ }
                <td style={{ width: isFullWidthTd }}>
                  { study.name }
                </td>
                {/* <td>{ study.details.assessmentId }</td> */ }
                <td style={{ width: isFullWidthTd }}>
                  { study.isActive ? 'ACTIVE' : 'INACTIVE' }
                </td>
                <td style={{ width: isFullWidthTd }}>
                  { new Date(study.timestamp).toLocaleString() }
                </td>
                <td style={{ width: isFullWidthTd }}>
                  { study.adminEmails.join(', ') }
                </td>
                <td 
                  style={{ 
                    width: windowWidth <= 920 ? '100%' : '80px',
                    position: 'relative',
                  }}
                >
                  <div className={ sectionStyles.buttonContainer }>
                    <div className={ sectionStyles.buttonDiv }>
                      <button
                        type='button'
                        onClick={
                          (e: any) => toggleDropdown(study?.id)
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
                      { isDropdownVisible === study.id && (
                        <div
                          ref={ studyActionsDropdownRef }
                          style={ { position: 'relative' } }
                        >
                          <div className={ sectionStyles.dropdown }>
                            <Link href={ buttonHref(study?.id.toString()) }>
                              <button>
                                { ` View` }
                              </button>
                            </Link>
                            <Link
                              href={ `/edit-studies/study/${study.id}` }
                            >
                              <Link href={ '' }>
                                <button>
                                  { `Edit` }
                                </button>
                              </Link>
                            </Link>
                            <button
                              // href='#'
                              onClick={ () => alert('Delete study') }
                            >
                              { ` Delete` }
                            </button>
                          </div>
                        </div>
                      ) }
                    </div>
                  </div>
                </td>
              </tr>
            </Fragment>
          )) }
        </tbody>
      </table>   
    </>
  )
}


export default StudiesTable
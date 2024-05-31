// Externals
import Link from 'next/link'
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
import { STUDY__DYNAMODB } from '@/utils'
// Hooks
import useWindowWidth from '@/hooks/useWindowWidth'
import useClickOutside from '@/hooks/useClickOutside'
// CSS
import sectionStyles from '../ListOfStudies.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type StudiesTableProps = {
  studies: STUDY__DYNAMODB[] | []
  state: {
    isStudyDeleted: boolean
    isDeletingStudy: boolean
    setIsStudyDeleted: Dispatch<SetStateAction<boolean>>
    setIsDeletingStudy: Dispatch<SetStateAction<boolean>>
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
                  { new Date(study.createdAtTimestamp).toLocaleString() }
                </td>
                <td style={{ width: isFullWidthTd }}>
                  { study.adminEmails?.join(', ') }
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
                          style={{ position: 'relative' }}
                        >
                          <div className={ sectionStyles.dropdown }>
                            <Link href={ buttonHref(study?.id.toString()) }>
                              <button
                                style={{ borderRadius: '4px 4px 0px 0px' }}
                              >
                                { ` View` }
                              </button>
                            </Link>
                            <Link
                              href={ `/edit-studies/study/${study.id}` }
                            >
                              <button>
                                { `Edit` }
                              </button>
                            </Link>
                            <button
                              // href='#'
                              style={{ borderRadius: '0px 0px 4px 4px' }}
                              onClick={ 
                                (e: any) => handleDeleteStudy(
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
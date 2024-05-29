'use client'

// Externals
import {
  FC,
  useRef,
  Fragment,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
// Locals
// Components
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Hooks
import useClickOutside from '@/hooks/useClickOutside'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import sectionStyles from './ListOfStudies.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type ListOfStudiesProps = {

}



const TABLE_HEADERS = [
  // `ID`,
  `Name`,
  `Assessment ID`,
  `Status`,
  `Date`,
  `Admin Emails`,
]



const ListOfStudies: FC<ListOfStudiesProps> = ({

}) => {
  // Contexts
  const { email } = useContext(AuthenticatedUserContext)
  // Refs
  const studyActionsDropdownRef = useRef<any>(null)
  // States
  const [ 
    isLoadingStudies, 
    setIsLoadingStudies 
  ] = useState<boolean>(false)
  const [ 
    isDropdownVisible, 
    setIsDropdownVisible 
  ] = useState<string | null>(null)
  const [ studies, setStudies ] = useState<any>([])


  const buttonHref = (studyId: string): string => `/view-studies/study/${studyId}`


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


  const toggleDropdown = (studyId: string) => {
    console.log(`studyId toggled`, studyId)

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
              style={ {
                width: '100%',
                margin: '24px 0',
                overflowX: 'auto',
              } }
            >
              { studies ? (
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
                            {/* <td>{ study.id.slice(0, 6) + '...' }</td> */}
                            <td>{ study.name }</td>
                            <td>{ study.details.assessmentId }</td>
                            <td>{ study.isActive ? 'ACTIVE' : 'INACTIVE' }</td>
                            <td>{ new Date(study.timestamp).toLocaleString() }</td>
                            <td>{ study.adminEmails.join(', ') }</td>
                            <td style={{ minWidth: '150px' }}>
                              <div className={ sectionStyles.buttonContainer }>
                                <div className={ sectionStyles.buttonDiv }>
                                  <button
                                    ref={ studyActionsDropdownRef }
                                    type='button'
                                    onClick={ 
                                      (e: any) => toggleDropdown(study?.id) 
                                    }
                                  >
                                    <p 
                                      style={{
                                        ...definitelyCenteredStyle,
                                        position: 'relative',
                                        marginRight: '4px',
                                      }}
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
                                  {/* Dropdown menu */}
                                  { isDropdownVisible === study.id && (
                                    <div className={ sectionStyles.dropdown }>
                                      <Link href={ buttonHref(study?.id.toString()) }>
                                        <button>
                                          {` View Details` }
                                        </button>
                                      </Link>
                                      <Link 
                                        href={ `/edit-studies/study/${study.id}` }
                                      >
                                        <button>
                                          {` Edit Study` }
                                        </button>
                                      </Link>
                                      <button 
                                        // href='#'
                                        onClick={ () => alert('Delete study') }
                                      >
                                        {` Delete Study` }
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </Fragment>
                      )) }
                    </tbody>
                  </table>
                </>
              ) : (
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
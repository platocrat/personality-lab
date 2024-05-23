'use client'

// Externals
import Link from 'next/link'
import router from 'next/router'
import { 
  FC, 
  Fragment, 
  useState,
  useContext, 
  useLayoutEffect, 
} from 'react'
// Locals
import ViewStudy from '../study'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Utils
import { STUDY__DYNAMODB } from '@/utils'
// CSS
import appStyles from '@/app/page.module.css'
import sectionStyles from './ListOfStudies.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type ListOfStudiesProps = {

}



const TABLE_HEADERS = [
  `ID`,
  `Name`,
  `Active?`,
  `Date`,
  `Admin Emails`,
  `Description`,
  `Allowed Submissions`,
  ``,
]



const ListOfStudies: FC<ListOfStudiesProps> = ({

}) => {
  // Contexts
  const { email } = useContext(AuthenticatedUserContext)
  // States
  const [ 
    isLoadingStudies, 
    setIsLoadingStudies 
  ] = useState<boolean>(false)
  const [ studies, setStudies ] = useState<any>([])


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



  useLayoutEffect(() => {
    const requests = [
      getStudies(),
    ]

    Promise.all(requests)
  }, [  ])




  return (
    <>
      { isLoadingStudies ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              marginTop: '24px',
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
              <table className={ sectionStyles.table }>
                <thead>
                  <tr>
                    { TABLE_HEADERS.map((name: string, i: number) => (
                      <Fragment key={ i }>
                        <th
                          style={{
                            width: name === 'Allowed Submissions' ? '70px' : ''
                          }}
                        >
                          { name }
                        </th>
                      </Fragment>
                    )) }
                  </tr>
                </thead>
                <tbody>
                  { studies.map((study: STUDY__DYNAMODB, i: number) => (
                    <Fragment key={ i }>
                      <tr>
                        <td>{ study.id.slice(0, 6) + '...' }</td>
                        <td>{ study.name }</td>
                        <td>{ study.isActive ? 'Yes' : 'No' }</td>
                        <td>{ new Date(study.timestamp).toLocaleString() }</td>
                        <td>{ study.adminEmails.join(', ') }</td>
                        <td>{ study.details.description }</td>
                        <td>{ study.details.allowedSubmissionsPerParticipant }</td>
                        <td>
                          <Link href={ `/view-studies/study/${study.id.toString()}` }>
                            <button
                              type='button'
                              style={ { width: '100px' } }
                              className={ appStyles.button }
                            >
                              { `View Study` }
                            </button>
                          </Link>
                        </td>
                      </tr>
                    </Fragment>
                  )) }
                </tbody>
              </table>
            </div>
        </>
      ) }
    </>
  )
}


export default ListOfStudies
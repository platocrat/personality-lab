'use client'

// Externals
import Link from 'next/link'
import router from 'next/router'
import { FC, Fragment, useContext, useLayoutEffect, useState } from 'react'
// Locals
import ViewStudy from '../study'
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
    isWaitingForResponse, 
    setIsWaitingForResponse 
  ] = useState<boolean>(false)
  const [ studies, setStudies ] = useState<any>([])



  function handleOnViewStudy(e: any, id: string, studyName: string) {
    const href = `${ id }-studyName`

    router.push(href)
  }


  // -------------------------- Async functions --------------------------------
  async function getStudies() {
    setIsWaitingForResponse(true)

    try {
      const response = await fetch(`/api/study?adminEmail=${ email }`, {
        method: 'GET',
      })

      const json = await response.json()

      if (response.status === 500) throw new Error(json.error)
      if (response.status === 405) throw new Error(json.error)

      setStudies(json.studies)
      setIsWaitingForResponse(false)
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
      <div style={{ marginTop: '24px' }}>
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
                  <td>{ study.id }</td>
                  <td>{ study.name }</td>
                  <td>{ study.isActive ? 'Yes' : 'No' }</td>
                  <td>{ new Date(study.timestamp).toLocaleString() }</td>
                  <td>{ study.adminEmails.join(', ') }</td>
                  <td>{ study.details.description }</td>
                  <td>{ study.details.allowedSubmissionsPerParticipant }</td>
                  <td>
                    <Link href={ `/view-study/${study.name}` }>
                      <button
                        style={ { width: '80px' } }
                        className={ appStyles.button }
                        onClick={ 
                          (e: any) => handleOnViewStudy(
                            e, 
                            study.id, 
                            study.name
                          )
                        }
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
  )
}


export default ListOfStudies
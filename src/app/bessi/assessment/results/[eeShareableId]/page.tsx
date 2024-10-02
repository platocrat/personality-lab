'use client'

// Externals
import {
  FC,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
} from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiResultsExplanation from '@/sections/assessments/bessi/assessment/results/explanation'
import BessiWantToLearnMore from '@/sections/assessments/bessi/assessment/results/want-to-learn-more'
import BessiResultsVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Context types
import { BessiSkillScoresContextType } from '@/contexts/types'
// Utils
import {
  CSCrypto,
  RESULTS__DYNAMODB,
  BessiUserResults__DynamoDB,
} from '@/utils'
// Types
import {
  BessiSkillScoresType
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



// ---------------------------------- Types ------------------------------------
type BessiUserSharedResultsType = {
  params: {
    eeShareableId: string
  }
}

// ------------------------------- Constants -----------------------------------
const rateUserResults = true
const ASSESSMENT_ID = 'bessi'

// --------------------------- Function Component ------------------------------
const BessiUserSharedResults: FC<BessiUserSharedResultsType> = ({ 
  params 
}) => {
  // Param
  const { eeShareableId } = params
  // Contexts
  const { 
    bessiSkillScores,
    setBessiSkillScores,
  } = useContext<BessiSkillScoresContextType>(
    BessiSkillScoresContext
  )
  // State
  const [ 
    isAccessTokenExpired, 
    setIsAccessTokenExpired
  ] = useState<boolean>(false)
  const [ id, setId ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ studyId, setStudyId ] = useState<string>('')
  const [ accessToken, setAccessToken ] = useState<string>('')
  const [ isDataLoading, setIsDataLoading ] = useState<boolean>(true)


  const errorMessage =  isAccessTokenExpired 
    ? `Access token expired!`
    : `ID and access token were not found!`
  

  // Memoized constants
  const errorStatus = useMemo((): boolean => {
    return (
      isAccessTokenExpired || 
      !id ||
      !accessToken &&
      (!email || !studyId) // Either `email` or `studyId` will be present
    )
  }, [ isAccessTokenExpired, id, accessToken, email, studyId ])


  // --------------------------- Async functions -------------------------------
  async function getUserResults() {
    try {
      const apiEndpoint = `/api/v1/assessment/share-results?eeShareableId=${ 
        eeShareableId 
      }`
      const response = await fetch(apiEndpoint, { method: 'GET' })

      const json = await response.json()

      if (response.status === 200) {
        const userResults: RESULTS__DYNAMODB = json.userResults
        
        const { facetScores, domainScores } = (
          userResults.results as BessiUserResults__DynamoDB
        )

        const bessiSkillScores_: BessiSkillScoresType = {
          id,
          accessToken,
          studyId,
          facetScores,
          domainScores,
        }

        setBessiSkillScores(bessiSkillScores_)
        setIsDataLoading(false)
      } else if (json.error === 'Access token expired') {
        setIsAccessTokenExpired(true)
        setIsDataLoading(false)
      } else {
        setIsDataLoading(false)

        const error = `Could not get results from the provided id: '${
          id
        }', access token: '${
          accessToken
        }', email: '${
          email
        }', and studyId: '${ 
          studyId 
        }': `
        
        /**
         * @todo Handle error UI here
         */
        throw new Error(error, json.error)
      }
    } catch (error: any) {
      setIsDataLoading(false)
      console.error(error)

      /**
       * @todo Handle error UI here
       */
      throw new Error(`Error! `, error)
    }
  }

  
  async function getDecryptedShareableId(): Promise<string> {
    return await CSCrypto.decodeDecompressDecrypt(eeShareableId)
  }

  
  async function getAuthorizationCredentials() {
    const shareableId = await getDecryptedShareableId()
    
    // Split the string by the separator '--'
    const parts = (shareableId as string).split('--')

    let id_ = '',
      accessToken_ = '',
      email_ = '',
      studyId_ = ''

    id_ = parts[0]
    accessToken_ = parts[1]
    email_ = parts[2]
    studyId_ = parts[3] ?? ''

    setId(id_)
    setEmail(email_)
    setAccessToken(accessToken_)
    setStudyId(studyId_)

    return { id_, accessToken_, email_, studyId_ }
  }

  
  // ----------------------------- `useLayoutEffect`s --------------------------
  useLayoutEffect(() => {
    getAuthorizationCredentials().then((credentials) => {
      const { id_, accessToken_, email_, studyId_ } = credentials
      
      if (
        !id_ || 
        !accessToken_ && 
        (!email_ || !studyId_) // Either `email` or `studyId` will be present
      ) {
        /**
         * @todo Replace the line below by handling the error on the UI here
         */
        throw new Error(
          `Error: 'id', 'accessToken', 'email', or 'studyId' is invalid , see 'id': ${
            id_
          }, 'accessToken': ${
            accessToken_
          }, ${
            email
          }, and 'studyId': ${
            studyId_
          } !`
        )
      } else {
        const requests = [
          getUserResults(),
        ]

        Promise.all(requests).then((response: any) => { })
      }
    })
  }, [ id, accessToken, email, studyId ])




  return (
    <>
      { isDataLoading ? (
        <>
          <div
            style={ {
              ...definitelyCenteredStyle,
              position: 'relative',
              top: '80px',
            } }
          >
            <Spinner height='40' width='40' />
          </div>
        </>
      ) : (
        <>
            { errorStatus ? (
              <>
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                    marginTop: '100px'
                  } }
                >
                  <h2>{ errorMessage }</h2>
                </div>
              </>
            ) : (
              <main className={ `${styles.main} ` }>
                <div style={ { maxWidth: '800px' } }>
                  <BessiResultsExplanation email={ email } />
                  <BessiResultsVisualization 
                    rateUserResults={ rateUserResults } 
                  />
                  <BessiResultsSkillsScoresAndDefinitions />
                  <BessiWantToLearnMore />
                </div>
              </main>
            ) }
        </>
      ) }
    </>
  )
}

export default BessiUserSharedResults
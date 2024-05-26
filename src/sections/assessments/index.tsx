// Externals
import Link from 'next/link'
import { FC, Fragment, JSX, ReactNode, useContext, useLayoutEffect, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
import StellarPlot from '@/components/DataViz/StellarPlot'
// Sections
import BessiDescription from './bessi/description'
import BigFiveDescription from './big-five/descriptions/entrance'
import BessiResultsVisualization from './bessi/assessment/results/bessi-results-visualization'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Utils
import { 
  dummyVariables,
  bessiActivityBank,
  SkillDomainFactorType, 
  PARTICIPANT__DYNAMODB,
  ACCOUNT__DYNAMODB
} from '@/utils'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type PersonalityAssessmentType = {
  href: string
  title: string
  buttonText: string
  assessmentId: string
  description: string | ReactNode
}



const title = `Assessments`



// const YourPersonalityDescription = () => {
//   return (
//     <>
//       { `Click the button below to begin to take an attachment and personality survey.` }
//       <br />
//       { `Please note that we do not store any information from these assessments.` }
//     </>
//   )
// }


const pAssessments: PersonalityAssessmentType[] = [
  {
    href: `/bessi`,
    title: `The BESSI`,
    buttonText: `Begin`,
    assessmentId: 'bessi',
    description: <BessiDescription />,
  },
  {
    href: `/big-five`,
    title: `Big Five, Vocational Interests, and Creativity Test`,
    buttonText: `Begin`,
    assessmentId: 'big-five',
    description: <BigFiveDescription />,
  },
  // {
  //   buttonText: `Begin`,
  //   title: 'yourPersonality',
  //   description: <YourPersonalityDescription />,
  //   href: `/${topLevelSlug}/your-personality`
  // },
]




const PersonalityAssessments = ({ }) => {
  // Contexts
  const { email } = useContext(AuthenticatedUserContext)
  // States
  const [ 
    isGettingParticipant, 
    setIsGettingParticipant
  ] = useState<boolean>(false)
  const [ 
    participant, 
    setParticipant 
  ] = useState<PARTICIPANT__DYNAMODB | null>(null)


  function fragmentKey(pa: PersonalityAssessmentType, i: number): string {
    const fragmentKeyBasePrefix = `personality-assessment-`
    const fragmentKeySuffix = `${pa.buttonText}-${pa.href}-${pa.title}-${i}`
    return fragmentKeyBasePrefix + fragmentKeySuffix
  }


  // ---------------------------- Async functions ------------------------------
  /**
   * @dev Request account entry from `accounts` table which has a `participant`
   *      property.
   */
  async function getParticipant() {
    setIsGettingParticipant(true)

    try {
      const API_ENDPOINT = `/api/account?email=${email}`
      const response = await fetch(API_ENDPOINT, { method: 'GET' })

      const json = await response.json()


      if (response.status === 200) {
        const account: ACCOUNT__DYNAMODB = json.account
        const _ = account?.participant ?? null
        
        setParticipant(_)
        setIsGettingParticipant(false)
      } else if (response.status === 404) {
        setIsGettingParticipant(false)
      } else if (response.status === 500) {
        setIsGettingParticipant(false)
        throw new Error(json.error)
      }
    } catch (error: any) {
      setIsGettingParticipant(false)
      throw new Error(error)
    }
  }

  // ---------------------------- `useLayoutEffect`s ---------------------------
  useLayoutEffect(() => {
    if (email) {
      const requests = [
        getParticipant(),
      ]
  
      Promise.all(requests)
    }
  }, [ email ])




  return (
    <Fragment key={ `personality-assessments` }>
      <div className={ styles.main }>
        <div style={{ marginBottom: '8px' }}>
          <h1>{ title }</h1>
        </div>
        <div className={ styles.assessmentWrapper }>
          { pAssessments.map((pa: PersonalityAssessmentType, i: number) => (
            <Fragment key={ fragmentKey(pa, i) }>
              <Card
                href={ pa.href }
                title={ pa.title }
                buttonText={ pa.buttonText }
                description={ pa.description }
                />
              {
                i !== pAssessments.length - 1
                ? (
                  <>
                      <div style={ definitelyCenteredStyle }>
                        <div className={ styles.divider } />
                      </div>
                    </>
                  )
                  : null
                }
            </Fragment>
          )) }
        </div>
      </div>
    </Fragment>
  )
}

export default PersonalityAssessments
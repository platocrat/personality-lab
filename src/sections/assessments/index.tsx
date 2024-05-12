// Externals
import Link from 'next/link'
import { FC, Fragment, JSX, ReactNode, useState } from 'react'
// Locals
// Components
import Card from '@/components/Card'
import StellarPlot from '@/components/DataViz/StellarPlot'
// Sections
import BessiDescription from './bessi/description'
import GenderAndCreativityUsDescription from './gender-and-creativity-us/description'
import BessiResultsVisualization from './bessi/assessment/results/bessi-results-visualization'
// Constants
import { dummyVariables } from '@/utils/bessi/constants'
// Types
import { SkillDomainFactorType } from '@/utils/bessi/types'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type PersonalityAssessmentType = {
  title: string
  buttonText: string
  description: string | ReactNode
  href: string
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
    buttonText: `Begin`,
    title: `Big Five, Vocational Interests, and Creativity Test`,
    description: <GenderAndCreativityUsDescription />,
    href: `/gender-and-creativity-us`,
  },
  {
    buttonText: `Begin`,
    title: `The BESSI`,
    description: <BessiDescription />,
    href: `/bessi`,
  },
  // {
  //   buttonText: `Begin`,
  //   title: 'yourPersonality',
  //   description: <YourPersonalityDescription />,
  //   href: `/${topLevelSlug}/your-personality`
  // },
]




const PersonalityAssessments = ({ }) => {
  function fragmentKey(pa: PersonalityAssessmentType, i: number): string {
    const fragmentKeyBasePrefix = `personality-assessment-`
    const fragmentKeySuffix = `${pa.buttonText}-${pa.href}-${pa.title}-${i}`
    return fragmentKeyBasePrefix + fragmentKeySuffix
  }


  return (
    <Fragment key={ `personality-assessments` }>
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
                ? <div className={ styles.divider } />
                : null
            }
          </Fragment>
        )) }
      </div>
    </Fragment>
  )
}

export default PersonalityAssessments
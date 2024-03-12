// Externals
import Link from 'next/link'
import { FC, Fragment, JSX, ReactNode, useState } from 'react'
// Locals
import Card from '@/components/Card'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'


type PersonalityAssessmentType = {
  title: string
  buttonText: string
  description: string | ReactNode
  href: string
}


const topLevelSlug = `assessments`

const BessiDescription = () => {
  return (
    <>
      {
        `This assessment is called the Behavioral, Emotional, and Social Skills Inventory (BESSI) developed by `
      }
      <a
        style={ { color: '#007ac0', textDecoration: 'underline' } }
        href={`https://psychology.illinois.edu/directory/profile/bwrobrts`}
        target='_blank'
      >
        { `Brent W. Roberts` }
      </a>
      {
        `, Christopher J. Soto, Christopher Napolitano, Madison Sewell, and Heejun Yoon. The BESSI measures specific skills across five broad categories: Self-Management, Social Engagement, Cooperation, Emotional Resilience, and Innovation.`
      }
      <br />
      <br />
      {
        `The BESSIE uses a skills inventory format, meaning that each BESSI item describes a specific, skill-relevant behavior, and users rate how well they can perform that behavior.`
      }
      <br />
      <br />
      { `Click the button below to begin the assessment.` }
      <br /> 
      { `Please note that we do not store any information from these assessments` }
    </>
  )
}

const YourPersonalityDescription = () => {
  return (
    <>
      { `Click the button below to begin to take an attachment and personality survey.` }
      <br />
      { `Please note that we do not store any information from these assessments.` }
    </>
  )
}


const pAssessments: PersonalityAssessmentType[] = [
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
  const title = `Assessments`

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
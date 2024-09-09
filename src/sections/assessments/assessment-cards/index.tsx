// Externals
import { FC, Fragment } from 'react'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import BessiDescription from '../bessi/description'
import BigFiveDescription from '../big-five/descriptions/entrance'
// Types
import { PersonalityAssessmentType } from '..'
// CSS
import styles from '@/app/page.module.css'
import { definitelyCenteredStyle } from '@/theme/styles'



type AssessmentCardsProps = {
  fragmentKey: (pa: PersonalityAssessmentType, i: number) => string
}



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





const AssessmentCards: FC<AssessmentCardsProps> = ({
  fragmentKey,
}) => {
  return (
    <>
      { pAssessments.map((
        pa: PersonalityAssessmentType,
        i: number
      ) => (
        <Fragment key={ fragmentKey(pa, i) }>
          <Card
            href={ pa.href }
            title={ pa.title }
            buttonText={ pa.buttonText }
            description={ pa.description }
          />
          { i !== pAssessments.length - 1 && (
            <>
              <div 
                style={{ 
                  ...definitelyCenteredStyle, 
                  margin: '12px 0px -12px 0px' 
                }}
              >
                <div className={ styles.divider } />
              </div>
            </>
          ) }
        </Fragment>
      )) }
    </>
  )
}


export default AssessmentCards
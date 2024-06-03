// Externals
import { FC, useContext, useMemo, Fragment } from 'react'
// Locals
// Components
import Card from '@/components/Card'
// Sections
import BessiDescription from '../bessi/description'
import BigFiveDescription from '../big-five/descriptions/entrance'
// Contexts
import { AuthenticatedUserContext } from '@/contexts/AuthenticatedUserContext'
// Types
import { PersonalityAssessmentType } from '..'
// CSS
import styles from '@/app/page.module.css'
import { PARTICIPANT__DYNAMODB } from '@/utils'
import { definitelyCenteredStyle } from '@/theme/styles'



type AssessmentCardsProps = {
  participant: PARTICIPANT__DYNAMODB | null
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
  participant,
  fragmentKey,
}) => {
  const { isAdmin } = useContext(AuthenticatedUserContext)

  // ----------------------- Memoized constants --------------------------------
  const participantAssessmentIds: string[] = useMemo((): string[] => {
    return participant?.studies.map(s => s.assessmentId) ?? ['']
  }, [participant])

  const PPAs: PersonalityAssessmentType[] = useMemo(
    (): PersonalityAssessmentType[] => {
      return pAssessments.filter((item, i: number): boolean => (
        item.assessmentId === participantAssessmentIds[i]
      ))
    }, [participantAssessmentIds]
  )


  const PAs = isAdmin ? pAssessments : PPAs



  return (
    <>
      { PAs.map((
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
          { PAs.length !== 1 && i !== pAssessments.length - 1 && (
            <>
              <div style={{ ...definitelyCenteredStyle, margin: '12px 0px -12px 0px' }}>
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
// Externals
import { MutableRefObject, FC } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
import { BessiSkillScoresType } from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'



type UserVisualizationType = {
  isExample: boolean
  rateUserResults: boolean
  currentVisualization: number
  screenshot1Ref: MutableRefObject<any>
  bessiSkillScores: BessiSkillScoresType | null
  renderVisualization: (isExample: boolean, i: number) => JSX.Element | null
}





const UserVisualization: FC<UserVisualizationType> = ({
  isExample,
  screenshot1Ref,
  rateUserResults,
  bessiSkillScores,
  renderVisualization,
  currentVisualization,
}) => {
  return (
    <>
      { bessiSkillScores?.domainScores
        ? (
          <>
            <div ref={ screenshot1Ref }>
              { renderVisualization(isExample, currentVisualization) }
            </div>
          </>
        ) : (
          <>
            <div style={ { ...definitelyCenteredStyle, margin: '24px' } }>
              <Spinner height='72' width='72' />
            </div>
          </>
        )
      }
    </>
  )
}


export default UserVisualization
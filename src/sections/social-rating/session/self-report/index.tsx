// Externals
import { FC } from 'react'
// Locals
import { BESSI_ACTIVITIES } from '@/utils'
import BessiAssessment from '@/sections/assessments/bessi/assessment'


type SelfReportProps = {
  onCompletion: () => void
}


const SelfReport: FC<SelfReportProps> = ({
  onCompletion,
}) => {
  const BESSI_20_ACTIVITIES = BESSI_ACTIVITIES['self-report'][20]


  return (
    <>
      <BessiAssessment />
    </>
  )
}


export default SelfReport
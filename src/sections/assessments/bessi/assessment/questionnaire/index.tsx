// Externals
import { 
  FC, 
  Fragment, 
  useState,
  useEffect,
  useContext, 
  useLayoutEffect,
} from 'react'
// Locals
import TableRadioInput from '@/components/Input/Selection/Table'
// Contexts
import { UserScoresContext } from '@/contexts/UserScoresContext'
// Constants
import { 
  getFacet, 
  getSkillDomainAndWeight
} from '@/utils'
import { 
  wellnessRatings,
  bessiActivityBank,
  wellnessRatingDescriptions,
} from '@/utils/assessments/bessi/constants'
// Types
import { 
  BessiActivityType, UserScoresType
} from '@/utils/assessments/bessi/types'



const QuestionText: FC<{ obj: BessiActivityType }> = ({ obj }) => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <p style={ { marginRight: '8px' } }>
          { `${obj.id}. ` }
        </p>
        <p>
          { obj.activity }
        </p>
      </div>
    </>
  )
}


const BessiQuestionnaire: FC = () => {
  // Contexts
  const { userScores, setUserScores } = useContext(UserScoresContext)
  // States
  const [isMobile, setIsMobile] = useState<boolean>(false)

  let mobileMediaQuery: any

  if (typeof window !== 'undefined') {
    mobileMediaQuery = window.matchMedia('(max-width: 700px)')
  }

  //------------------------- Regular function handlers ------------------------
  function onWellnessRatingChange(e: any, itemIndex: number) {
    // Use `itemIndex + 1` because `bessiActivityBank` has no value for 0.
    const _itemIndex = itemIndex + 1

    const _userScore: UserScoresType = {
      facet: getFacet(_itemIndex),
      ...getSkillDomainAndWeight(getFacet(_itemIndex)),
      response: e.target.value
    }

    setUserScores({ 
      ...userScores,
      [`${_itemIndex}`]: _userScore
    })
  }

  function handleMobile(e: any): void {
    setIsMobile(e.matches ? true : false)
  }

  // ----------------------------- useLayoutEffects ----------------------------
  useLayoutEffect((): void => {
    // The line below is required to set `isMobile` on initial render
    handleMobile(mobileMediaQuery)
    mobileMediaQuery.addEventListener("change", handleMobile)
  }, [isMobile])


  return (
    <>
      <div 
        style={{ marginBottom: '48px' }}
        id={ `bessi-questionnaire` }
      >
        <TableRadioInput
          items={ bessiActivityBank }
          onChange={ onWellnessRatingChange }
        />
      </div>
    </>
  )
}

export default BessiQuestionnaire
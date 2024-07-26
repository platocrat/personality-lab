'use client'

// Externals
import { 
  FC,
  useMemo,
  Fragment, 
  Dispatch,
  useState, 
  useEffect, 
  useContext, 
  CSSProperties,
  SetStateAction,
} from 'react'
// Locals
import Instructions from './instructions'
import SocialRatingNotification from './notification'
import SocialRatingInstructions from './instructions'
// Components
import Spinner from '@/components/Suspense/Spinner'
// Sections
import CharacterContent from './character-content'
import BessiResultsVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Contexts
import { BessiSkillScoresContextType } from '@/contexts/types'
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
// Utils
import {
  UserScoresType,
  FacetFactorType,
  findNthOccurrence,
  generateButtonStyle,
  BESSI_45_ACTIVITIES,
  calculateBessiScores,
  SkillDomainFactorType,
  BESSI_45_ACTIVITY_BANK,
} from '@/utils'
import { 
  CharacterType, 
  updateCharacters,
  generateCharacterProfile,
} from '@/utils/social-rating/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import mainPortalStyle from '@/sections/main-portal/MainPortal.module.css'
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'




type FictionalCharactersProps = {
  
}



const FictionalCharacters: FC<FictionalCharactersProps> = ({

}) => {
  // States
  const [ characters, setCharacters ] = useState<CharacterType[]>([])
  // Booleans
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ completed, setCompleted ] = useState<boolean>(false)
  // Numbers
  const [ progress, setProgress ] = useState<number>(0)
  const [ totalCharacters, setTotalCharacters ] = useState<number>(0)
  const [ currentPromptIndex, setCurrentPromptIndex ] = useState<number>(0)


  // ------------------------------------ Constants ----------------------------
  const prompts = [
    'Generate a personality profile for a single character from American Horror Story.',
    'Generate a personality profile for a single character from Euphoria.',
    'Generate a personality profile for a single character from The Big Bang Theory.',
    // Add more prompts if needed
  ]

  const totalPrompts = prompts.length

  // ------------------------------ Memoized constants -------------------------
  const characterGenerationHelperText = useMemo(() => {
    const promptIndex = loading
      ? currentPromptIndex - 1
      : currentPromptIndex

    const suffix = `${currentPromptIndex !== totalPrompts ? `On prompt ${currentPromptIndex}` : ''
      }`

    const _ = `Generated ${progress} characters from ${promptIndex}/${totalPrompts} prompts. ${suffix}`
  }, [progress, currentPromptIndex])


  // ------------------------------- Event handlers ----------------------------
  const generateCharacters = async () => {
    setLoading(true)
    setCompleted(false)
    setProgress(0)

    const newCharacters: CharacterType[] = []
    setCharacters(newCharacters) // Remove any previously generated characters

    for (const prompt of prompts) {
      await generateCharacterProfile(
        prompt,
        characters,
        setCharacters,
        setTotalCharacters,
        setProgress,
        setCurrentPromptIndex,
      )
    }

    setLoading(false)
    setCompleted(true)

    setTimeout(() => {
      setCompleted(false)
    }, 8_000) // Hide the notification after 8 seconds
  }



  return (
    <>
      <div className={ styles['container'] }>
        <SocialRatingInstructions
          generateCharacters={ generateCharacters }
          state={{
            loading,
            completed,
            totalPrompts,
            setCompleted,
            totalCharacters,
          }}
        />
        
        { /* AI-generated Characters */ }
        <CharacterContent characters={ characters } />
      </div>
    </>
  )
}

export default FictionalCharacters
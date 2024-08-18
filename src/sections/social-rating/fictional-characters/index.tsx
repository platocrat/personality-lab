'use client'

// Externals
import {
  FC,
  useCallback,
  useMemo,
  useState
} from 'react'
// Locals
import SocialRatingInstructions from './instructions'
// Sections
import CharacterContent from './character-content'
// Utils
import {
  CharacterType,
  generateCharacterProfile
} from '@/utils/social-rating/utils'
// CSS
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
  const prompts = useMemo((): string[] => [
    'Generate a personality profile for a single character from American Horror Story.',
    'Generate a personality profile for a single character from Euphoria.',
    'Generate a personality profile for a single character from The Big Bang Theory.',
    // Add more prompts if needed
  ], [])

  const totalPrompts = prompts.length

  // ------------------------------ Memoized constants -------------------------
  const characterGenerationHelperText = useMemo((): string => {
    const promptIndex = loading
      ? currentPromptIndex - 1
      : currentPromptIndex

    const suffix = `${
      currentPromptIndex !== totalPrompts 
        ? `On prompt ${currentPromptIndex}` 
        : ''
    }`

    const helperText = `Generated ${progress} characters from ${promptIndex}/${totalPrompts} prompts. ${suffix}`
    return helperText
  }, [progress, currentPromptIndex, loading, totalPrompts])


  // ------------------------------- Event handlers ----------------------------
  const generateCharacters = useCallback(async (): Promise<void> => {
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
  }, [ prompts, characters ])



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
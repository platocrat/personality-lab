'use client'

// Externals
import {
  FC,
  useCallback,
  useLayoutEffect,
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
  const [ reset, setReset ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ completed, setCompleted ] = useState<boolean>(false)
  // Numbers
  const [ progress, setProgress ] = useState<number>(0)
  const [ totalCharacters, setTotalCharacters ] = useState<number>(0)
  const [ currentPromptIndex, setCurrentPromptIndex ] = useState<number>(0)


  // ------------------------------------ Constants ----------------------------
  const prompts = useMemo((): string[] => [
    'Generate a personality profile for a single character from Euphoria.',
    'Generate a personality profile for a single character from The Big Bang Theory.',
    'Generate a personality profile for a single character from American Horror Story.',
    // Add more prompts if needed
  ], [])

  const totalPrompts = prompts.length

  // ------------------------------ Memoized constants -------------------------
  const characterGenerationHelperText = useMemo((): string => {
    const promptIndex = loading
      ? currentPromptIndex - 1
      : currentPromptIndex

    const suffix = `${currentPromptIndex !== totalPrompts
        ? `On prompt ${currentPromptIndex}`
        : ''
      }`

    const helperText = `Generated ${progress} characters from ${promptIndex}/${totalPrompts} prompts. ${suffix}`
    return helperText
  }, [progress, currentPromptIndex, loading, totalPrompts])


  // ----------------------------- Event handlers ------------------------------
  const generateCharacters = async (): Promise<void> => {
    setLoading(true)
    setCompleted(false)
    setProgress(0)
    setCurrentPromptIndex(0)

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

    const timeout = 8_000 // 8 seconds

    setTimeout(() => {
      setCompleted(false)
      setReset(true)
    }, timeout) // Hide the notification after 8 seconds
  }

  //-- ------------------------- `useLayoutEffect`s ----------------------------
  useLayoutEffect(() => {
    if (!loading) {
      const timeout = 1_000 // 1 seconds

      setTimeout(() => {
        setProgress(0)
        setTotalCharacters(0)
      }, timeout)
    }
  }, [ loading, reset ])



  return (
    <>
      <div className={ styles['container'] }>
        <SocialRatingInstructions
          generateCharacters={ generateCharacters }
          state={ {
            loading,
            completed,
            totalPrompts,
            setCompleted,
            totalCharacters,
            currentPromptIndex,
          } }
        />

        { /* AI-generated Characters */ }
        <CharacterContent characters={ characters } />
      </div>
    </>
  )
}

export default FictionalCharacters
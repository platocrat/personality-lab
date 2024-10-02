// Externals
import { FC, useCallback, useMemo, useState } from 'react'
// Locals
// Sections
import Generate from '../generate'
import CharacterContent from '../character-content'
import CharacterGenerationNotification from '../character-generation-notification'
// Utils
import { CharacterType, generateCharacterProfile } from '@/utils'



type GameProps = {
  
}




const Game: FC<GameProps> = ({}) => {
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
  const generateCharacters = useCallback(async (): Promise<void> => {
    setProgress(0)
    setLoading(true)
    setCompleted(false)
    setTotalCharacters(0)
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
    }, timeout) // Hide the notification after 8 seconds
  }, [prompts, characters])



  return (
    <>
      {/* Button to generate characters */}
      <Generate
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

      { /* Green success notification */ }
      <CharacterGenerationNotification
        state={ {
          completed,
          totalPrompts,
          setCompleted,
          totalCharacters,
        } }
      />

      { /* AI-generated Characters */ }
      <CharacterContent characters={ characters } />
    </>
  )
}

export default Game
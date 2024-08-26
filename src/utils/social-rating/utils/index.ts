// Externals
import { Dispatch, SetStateAction } from 'react'
// Locals
import { 
  UserScoresType, 
  FacetFactorType,
  BESSI_45_ACTIVITIES,
  calculateBessiScores,
  SkillDomainFactorType, 
  BESSI_45_ACTIVITY_BANK,
} from '@/utils/assessments'
import { findNthOccurrence } from '@/utils/misc'



export type CharacterType = {
  name: string
  group: string
  description: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
}


type GeneratedCharacterType = {
  group: string
  name: string
  description: string
  responses: {
    response: number
    id: number
    activity: string
  }[]
}[]





function update(
  genCharacter: any,
  characters: CharacterType[],
  setCharacters: Dispatch<SetStateAction<CharacterType[]>>,
  setProgress: Dispatch<SetStateAction<number>>,
) {
  const group = genCharacter.group
  const name = genCharacter.name
  const description = genCharacter.description

  const responses: UserScoresType[] = BESSI_45_ACTIVITY_BANK.map((
    activity,
    i: number
  ) => {
    const response = genCharacter.responses[i]

    return {
      facet: activity.facet,
      domain: activity.domain,
      weight: activity.weight,
      response: response.response
    }
  })

  const { facetScores, domainScores } = calculateBessiScores(responses)

  const character: CharacterType = {
    group,
    name,
    description,
    facetScores,
    domainScores
  }

  // console.log(`character: `, character)

  setCharacters(prevCharacters => [...prevCharacters, character])
  setProgress((prevProgress) => prevProgress + 1)
}




/**
 * @dev Utilty function to update the generated characters. Takes in a 
 * @param characters
 * @param setCharacters 
 * @param genCharacters 
 * @param setProgress 
 */
export function updateCharacters(
  characters: CharacterType[],
  setCharacters: Dispatch<SetStateAction<CharacterType[]>>,
  genCharacters: GeneratedCharacterType[],
  setProgress: Dispatch<SetStateAction<number>>
) {
  if (genCharacters.length > 0) {
    genCharacters.forEach((genC: GeneratedCharacterType) => {
      update(
        genC,
        characters,
        setCharacters,
        setProgress,
      )
    })
  } else {
    update(
      genCharacters,
      characters,
      setCharacters,
      setProgress,
    )
  }
}




/**
 * @dev Parse the AI-generated content, as a string, to JSON and update the 
 *      state of the array of character objects.
 * @param content AI-generated content that is returned from the LLM
 * @param setTotalCharacters 
 * @param characters Array of AI-generated character objects
 * @param setCharacters 
 * @param setProgress 
 */
export function parseContentAndUpdateCharacters(
  content: string,
  setTotalCharacters: Dispatch<SetStateAction<number>>,
  characters: CharacterType[],
  setCharacters: Dispatch<SetStateAction<CharacterType[]>>,
  setProgress: Dispatch<SetStateAction<number>>,
) {
  // Handle edge case where the content that is returned is not an array and
  // it has no starting nor ending curly brace.
  if (content.indexOf('[') !== 0 && content.indexOf('{') !== 0) {
    content = `{
        ${content.trim()}
      }`
  }

  const genCharacters = JSON.parse(content)
  const _totalCharacters = genCharacters.length

  /**
   * @dev 3.1.2 Update the counter of the total number of characters that 
   *            have been generated
   */
  setTotalCharacters(
    prevTotalCharacters => prevTotalCharacters + _totalCharacters
  )

  /**
   * @dev 3.1.3 Update the content of each character
   */
  if (_totalCharacters > 0) {
    genCharacters.forEach((_): void => (
      updateCharacters(characters, setCharacters, _, setProgress)
    ))
  } else {
    updateCharacters(characters, setCharacters, genCharacters, setProgress)
  }
}




/**
 * @dev OpenAI API request function
 * @param prompt 
 * @param characters 
 * @param setCharacters 
 * @param setTotalCharacters 
 * @param setProgress 
 * @param setCurrentPromptIndex 
 */
export async function generateCharacterProfile(
  prompt: string,
  characters: CharacterType[],
  setCharacters: Dispatch<SetStateAction<CharacterType[]>>,
  setTotalCharacters: Dispatch<SetStateAction<number>>,
  setProgress: Dispatch<SetStateAction<number>>,
  setCurrentPromptIndex: Dispatch<SetStateAction<number>>,
): Promise<void> {
  setCurrentPromptIndex(prevIndex => prevIndex + 1)

  const SYSTEM_CONTENT = `You will be provided with a fictional pop-culture series name (e.g. Harry Potter, Game of Thrones, Euphoria, The Big Bang Theory, American Horror Story, etc.). Your task is to simulate responses to the following 45 activities for up to 3 characters that are from the given pop-culture series: for each activity, respond with a rating between 1 and 5 to represent how others would rate that fictional pop-culture character, with 1 representing not at all likely to do the activity and 5 representing very much likely to do the activity. You must give the rating for each of the 45 activities in your response. Additionally, you must give the description of the personality of the character. For example, if given 'Harry Potter', you should respond with 'Harry Potter from the Harry Potter series is the brave protagonist of the series. Now, here are the responses to each of the 45 activities:'. The description must be around 250 words. Remember that this must be for each character. Furthermore, return your response as an array of JSON objects where each JSON object includes the description, the list of 45-ratings, and the character's name. To be clear, the type of the response that you must return is, 'type ResponsesType = { group: string, name: string, description: string, responses: { response: number, activity: string, id: number }[] }[]'. Below is the list of activities: ${BESSI_45_ACTIVITIES.join('?')}`

  const apiEndpoint = 'https://api.openai.com/v1/chat/completions'
  const response = await fetch(
    apiEndpoint,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        // stream: true,
        messages: [
          {
            'role': 'system',
            'content': SYSTEM_CONTENT,
          },
          {
            'role': 'user',
            'content': prompt,
          }
        ],
        // max_tokens: 2048, // Increase max tokens to handle detailed responses
      }),
    },
  )

  const json = await response.json()
  // console.log(`json: `, json)
  const data = json.choices[0]

  /**
   * @dev 2. Parse the generated content from the LLM
   */
  let content: string = data.message.content,
    startIndex = content.indexOf('```json'),
    genCharacters = []

  // Find the end index of '```'
  const firstDelimiter = '```'
  // Find the second occurrence of '```'
  const endIndex = findNthOccurrence(content, firstDelimiter, 2)

  startIndex = startIndex + (startIndex === -1 ? 3 : 7)

  /**
   * @dev 3.0 If there are 3 backticks in the string that is returned...
   */
  if (endIndex !== -1) {
    // 3.1 Slice the string starting after '```' and ending before the last '```'
    let cleanedString = content.slice(startIndex, endIndex).trim()

    parseContentAndUpdateCharacters(
      cleanedString,
      setTotalCharacters,
      characters,
      setCharacters,
      setProgress
    )
  } else {
    /**
     * @dev 3.2 If there are no 3 backticks in the string that is returned...
     */
    try {
      parseContentAndUpdateCharacters(
        content,
        setTotalCharacters,
        characters,
        setCharacters,
        setProgress
      )
    } catch (error: any) {
      /**
       * @dev 3.2.4 Handle the error on the interface
       */
      const errorMessage = `End delimiter not found. Here is the content:\n\n${content}\n\n\n`
      const contentMessage = `End delimiter not found. Here is the error:\n\n${error}\n\n\n`

      console.error(errorMessage)
      console.error(contentMessage)
      
      const errorWithContent = `${errorMessage + contentMessage}}`

      throw new Error(errorWithContent)
    }
  }
}
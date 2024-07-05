'use client'

// Externals
import React, { Fragment, useContext, useState, useEffect } from 'react'
// Locals
// Components
import Spinner from '@/components/Suspense/Spinner'
// Sections
import BessiResultsVisualization from '@/sections/assessments/bessi/assessment/results/bessi-results-visualization'
import BessiResultsSkillsScoresAndDefinitions from '@/sections/assessments/bessi/assessment/results/skills-scores-and-definitions'
// Contexts
import { BessiSkillScoresContext } from '@/contexts/BessiSkillScoresContext'
import { BessiSkillScoresContextType } from '@/contexts/types'
// Utils
import {
  UserScoresType,
  FacetFactorType,
  findNthOccurrence,
  BESSI_45_ACTIVITIES,
  calculateBessiScores,
  SkillDomainFactorType,
  BESSI_45_ACTIVITY_BANK,
} from '@/utils'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'

type Character = {
  name: string
  group: string
  description: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
}

function updateCharacters(
  characters,
  setCharacters,
  genCharacters: {
    group: string
    name: string
    description: string
    responses: {
      response: number
      id: number
      activity: string
    }[]
  }[],
  setProgress
) {
  function update(
    genCharacter: any,
    characters,
    setCharacters,
    setProgress,
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

    const character: Character = {
      group,
      name,
      description,
      facetScores,
      domainScores
    }

    console.log(`character: `, character)

    setCharacters(prevCharacters => [...prevCharacters, character])
    setProgress((prevProgress) => prevProgress + 1)
  }

  if (genCharacters.length > 0) {
    genCharacters.forEach((genC) => {
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

// OpenAI API request function
const generateCharacterProfile = async (
  prompt: string,
  characters,
  setCharacters,
  setProgress
): Promise<void> => {
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
        model: 'gpt-4',
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
  console.log(`json: `, json)
  const data = json.choices[0]

  let content = data.message.content,
    startIndex = content.indexOf('```json')

  // Find the end index of '```'
  const firstDelimiter = '```'
  // Find the second occurrence of '```'
  const endIndex = findNthOccurrence(content, firstDelimiter, 2)

  if (endIndex !== -1) {
    // Slice the string starting after '```' and ending before the last '```'
    const cleanedString = content.slice(startIndex + (startIndex === -1 ? 3 : 7), endIndex).trim()
    updateCharacters(characters, setCharacters, cleanedString, setProgress)
  } else {
    try {
      let genCharacters = JSON.parse(content)
      console.log(`JSON.parse(content): `, genCharacters)
      genCharacters = genCharacters.length > 0 ? genCharacters[0] : genCharacters
      updateCharacters(characters, setCharacters, genCharacters, setProgress)
    } catch (error) {
      console.error(`End delimiter not found. Here is the content: `, content)
      console.error(`End delimiter not found. Here is the error: `, error)
    }
  }
}




const FictionalCharacters: React.FC = () => {
  // States
  const [loading, setLoading] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [progress, setProgress] = useState<number>(0)

  const prompts = [
    'Generate a personality profile for a character from American Horror Story.',
    'Generate a personality profile for a character from Euphoria.',
    'Generate a personality profile for a character from The Big Bang Theory.',
    // Add more prompts if needed
  ]

  const totalCharacters = prompts.length

  const generateCharacters = async () => {
    setLoading(true)
    setCompleted(false)
    setProgress(0)

    const newCharacters: Character[] = []
    setCharacters(newCharacters) // Remove any previously generated characters

    for (const prompt of prompts) {
      await generateCharacterProfile(
        prompt,
        characters,
        setCharacters,
        setProgress
      )
    }

    setLoading(false)
    setCompleted(true)

    setTimeout(() => {
      setCompleted(false)
    }, 3_000) // Hide the notification after 3 seconds
  }




  return (
    <>
      <div className={ styles['container'] }>
        <h2>
          { `Fictional Characters in Popular Culture` }
        </h2>
        <button
          disabled={ loading }
          onClick={ generateCharacters }
          className={ styles['generate-button'] }
          style={{
            cursor: loading ? 'not-allowed' : '',
          }}
        >
          { loading
            ? (
              <>
                <div
                  style={ {
                    ...definitelyCenteredStyle,
                  } }
                >
                  <Spinner
                    height={ '22' }
                    width={ '22' }
                    style={ { stroke: 'white' } }
                  />
                </div>
              </>
            )
            : `Generate Characters`
          }
        </button>
        {/* Loading indicator and progress completion */ }
        { loading && (
          <>
            <div className={ styles['loading-container'] }>
              <p>
                { `Loading...` }
              </p>
              <p>
                { `Please wait while we generate the characters.` }
              </p>
            </div>
          </>
        ) }
        {/* Progress completion */ }
        { loading && (
          <div className={ styles['progress-container'] }>
            { `Generated ${progress} of ${totalCharacters} characters` }
            <div className={ styles['progress-bar'] }>
              <div
                className={ styles['progress-bar-fill'] }
                style={ { width: `${(progress / totalCharacters) * 100}%` } }
              ></div>
            </div>
          </div>
        ) }
        {/* Green success notification */ }
        { completed && (
          <>
            <div
              className={
                `${styles['notification-card']} ${completed ? '' : styles['hide']}`
              }
            >
              { `Character generation complete!` }
            </div>
          </>
        ) }
        
        {/* AI-generated Characters */ }
        { characters.map((character, index) => (
          <Fragment key={ index }>
            <div key={ index } className={ styles['character-card'] }>
            <div
              style={ {
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '12px',
              } }
            >
              <h3>
                { `${character.name}` }
              </h3>
              <em>
                <h4>
                  { `${character.group}` }
                </h4>
              </em>
            </div>

            <p style={ { fontSize: 'clamp(11px, 2.5vw, 14px)' } }>
              { character.description }
            </p>

            <BessiResultsVisualization
              isExample={ true }
              facetScores={ character.facetScores }
              domainScores={ character.domainScores }
            />

            <BessiResultsSkillsScoresAndDefinitions
              facetScores={ character.facetScores }
              domainScores={ character.domainScores }
            />
          </div>
      </Fragment>
        )) }
      </div>
    </>
  )
}

export default FictionalCharacters
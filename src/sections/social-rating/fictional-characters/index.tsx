// Externals
import React, { useState } from 'react'
// Locals
import description from '@/sections/assessments/bessi/description'
// Utils
import { 
  UserScoresType, 
  FacetFactorType, 
  BESSI_ACTIVITIES_45,
  BESSI_ACTIVITY_BANK,
  calculateBessiScores,
  SkillDomainFactorType,
} from '@/utils'
import { json } from 'd3'



// Define types
interface Character {
  name: string
  description: string
  facetScores: FacetFactorType
  domainScores: SkillDomainFactorType
}




// OpenAI API request function
const generateCharacterProfile = async (
  prompt: string
): Promise<{ 
  name: string, 
  description: string, 
  responses: UserScoresType[] 
}> => {
  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            'role': 'system',
            'content': `You will be provided with a fictional pop-culture series name (e.g. Harry Potter, Game of Thrones, Euphoria, The Big Bang Theory, American Horror Story, etc.). Your task is to simulate responses to the following 45 activities for up to 3 characters that are from the given pop-culture series: for each activity, respond with a rating between 1 and 5 to represent how that fictional pop-culture character would respond to it, with 1 representing not at all likely to do the activity and 5 representing very much likely to do the activity. You must give the rating for each of the 45 activities in your response. Additionally, you must give the description of the personality of the character. For example, if given "Harry Potter", you should respond with "Harry Potter from the Harry Potter series is the brave protagonist of the series. Now, here are the responses to each of the 45 activities:". The description must be around 250 words. Remember that this must be for each character. Below is the list of activities: ${ BESSI_ACTIVITIES_45.join('?') }`
          },
          {
            'role': 'user',
            'content': 'American Horror Story.'
          }
        ],
        // max_tokens: 2048, // Increase max tokens to handle detailed responses
      }),
    },
  )

  console.log(`response: `, response)

  const json = await response.json()

  console.log(`json: `, json)

  const data = json.data.choices[0].text.trim()
  const lines = data.split('\n')
  const name = lines[0].replace('Name: ', '')
  const description = lines[1].replace('Description: ', '')


  const responses: UserScoresType[] = BESSI_ACTIVITY_BANK.map((
    activity, 
    index
  ) => {
    const response = parseInt(lines[index + 2].split(': ')[1])
    return {
      facet: activity.facet,
      domain: activity.domain,
      weight: activity.weight,
      response: response
    }
  })


  return { name, description, responses }
}





const FictionalCharacters: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([])

  const generateCharacters = async () => {
    const prompts = [
      'Generate a fictional character profile for a character from the Big Bang Theory including responses to 192 activities.',
      'Generate a fictional character profile for a character from Harry Potter including responses to 192 activities.',
      'Generate a fictional character profile for a character from Euphoria including responses to 192 activities.',
      'Generate a fictional character profile for a character from Game of Thrones including responses to 192 activities.',
      // Add more prompts if needed
    ]

    const newCharacters: Character[] = []

    for (const prompt of prompts) {
      // Create a detailed prompt with all activities
      const detailedPrompt = `${prompt}\n\nActivities:\n${BESSI_ACTIVITY_BANK.map(
        activity => `${activity.activity}:`
      ).join('\n')}`

      const { name, description, responses } = await generateCharacterProfile(detailedPrompt)
      const { facetScores, domainScores } = calculateBessiScores(responses)

      newCharacters.push({
        name,
        description,
        facetScores,
        domainScores
      })
    }

    setCharacters(newCharacters)
  }




  return (
    <div>
      <h1>Fictional Pop-Culture Characters</h1>
      <button onClick={ generateCharacters }>Generate Characters</button>
      { characters.map((character, index) => (
        <div key={ index }>
          <h2>{ character.name }</h2>
          <p>{ character.description }</p>
          <h3>Facet Scores</h3>
          <ul>
            { Object.entries(character.facetScores).map(([facet, score]) => (
              <li key={ facet }>{ facet }: { score }</li>
            )) }
          </ul>
          <h3>Domain Scores</h3>
          <ul>
            { Object.entries(character.domainScores).map(([domain, score]) => (
              <li key={ domain }>{ domain }: { score }</li>
            )) }
          </ul>
        </div>
      )) }
    </div>
  )
}

export default FictionalCharacters
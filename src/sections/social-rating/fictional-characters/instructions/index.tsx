// Externals 
import { Dispatch, FC, SetStateAction } from 'react'
// Locals 
// Components
import Spinner from '@/components/Suspense/Spinner'
// Sections
import SocialRatingNotification from '../notification'
import SocialRatingInstructionsDescription from './description'
import CharacterGenerationSuspense from './character-generation-suspense'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'
import Generate from '../generate'



type SocialRatingInstructionsProps = {
}




const SocialRatingInstructions = ({
  state,
  generateCharacters,
}) => {
  const title = (
    <>
      <div>
        { `AI-Generated` }
      </div>
      <div>
        { `Fictional Characters from Popular Culture` }
      </div>
    </>
  )

  return (
    <>
      {/* Title */}
      <h2>
        { title }
      </h2>

      {/* Instructions */}
      {/**
       * @todo Include instructions for how to play the social rating game
       */}
      <SocialRatingInstructionsDescription />
    </>
  )
}


export default SocialRatingInstructions
// Externals 
import { Dispatch, SetStateAction } from 'react'
// Locals 
// Components
import Spinner from '@/components/Suspense/Spinner'
// Sections
import SocialRatingNotification from '../notification'
import SocialRatingInstructionsDescription from './description'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



export type SocialRatingInstructionsProps = {
  generateCharacters: (e: any) => void
  state: {
    loading: boolean
    completed: boolean
    totalPrompts: number
    totalCharacters: number
    setCompleted: Dispatch<SetStateAction<boolean>>
  }
}



const CharacterGenerationSuspense = ({
  loading,
}) => {
  return (
    <>
      { loading ? (
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
    </>
  )
}






const SocialRatingInstructions = ({
  state,
  generateCharacters,
}) => {
  return (
    <>
      {/* Title */}
      <h2>
        { `Fictional Characters in Popular Culture` }
      </h2>


      {/* Instructions */}
      {/**
       * @todo Include instructions for how to play the social rating game
       */}
      <SocialRatingInstructionsDescription />


      {/* Button to generate content */}
      <button
        disabled={ state.loading }
        onClick={ generateCharacters }
        className={ styles['generate-button'] }
        style={{
          cursor: state.loading ? 'not-allowed' : '',
        }}
      >
       <CharacterGenerationSuspense loading={ state.loading } />
      </button>

      { /* loading indicator and progress completion */ }
      { state.loading && (
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

      { /* Progress completion */ }
      <div className={ styles['progress-container'] }>
        { }
        <div className={ styles['progress-bar'] }>
          <div
            className={ styles['progress-bar-fill'] }
            style={{
              width: `${(state.currentPromptIndex - 1 / state.totalPrompts) * 100}%`
            }}
          />
        </div>
      </div>

      { /* Green success notification */ }
      <SocialRatingNotification
        state={ {
          completed: state.completed,
          totalPrompts: state.totalPrompts,
          setCompleted: state.setCompleted,
          totalCharacters: state.totalCharacters,
        } }
      />
    </>
  )
}


export default SocialRatingInstructions
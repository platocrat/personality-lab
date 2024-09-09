// Externals
import { Dispatch, FC, SetStateAction } from 'react'
// Locals
import CharacterGenerationSuspense from '../overview/character-generation-suspense'
// CSS
import styles from '@/sections/social-rating/fictional-characters/FictionalCharacters.module.css'



type GenerateProps = {
  generateCharacters: (e: any) => void
  state: {
    loading: boolean
    completed: boolean
    totalPrompts: number
    totalCharacters: number
    currentPromptIndex: number
    setCompleted: Dispatch<SetStateAction<boolean>>
  }
}



const Generate: FC<GenerateProps> = ({
  state,
  generateCharacters,
}) => {
  return (
    <>
      {/* Button to generate content */ }
      <button
        disabled={ state.loading }
        onClick={ generateCharacters }
        className={ styles['generate-button'] }
        style={ {
          cursor: state.loading ? 'not-allowed' : '',
        } }
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
              { `Please wait while we generate characters for each prompt.` }
            </p>
          </div>
        </>
      ) }

      { /* Progress completion */ }
      <div className={ styles['progress-container'] }>
        {/* Progress bar helper text */}
        { !state.loading && !state.completed ? (
          <>
            { '' }
          </>
        ) : state.loading && !state.completed
          ? `Generating prompt  ${state.currentPromptIndex}/${state.totalPrompts}`
          : `Generated ${state.completed} characters from ${state.totalPrompts} prompts`
        }
        {/* Progress bar */}
        { !state.loading && !state.completed ? (
          <>
            { '' }
          </>
        ) : (
          <>
            <div className={ styles['progress-bar'] }>
              <div
                className={ styles['progress-bar-fill'] }
                style={ {
                  width: `${(
                    (
                      state.currentPromptIndex - (state.loading ? 1 : 0)
                    ) / state.totalPrompts
                  ) * 100
                    }%`
                } }
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}


export default Generate
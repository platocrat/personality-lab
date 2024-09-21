// Externals
import { FC } from 'react'
// Locals
import Spinner from '@/components/Suspense/Spinner'
// CSS
import { definitelyCenteredStyle } from '@/theme/styles'
import styles from '@/sections/social-rating/session/GameSession.module.css'



type NicknameFormProps = {
  onSubmit: (e: any) => Promise<void>
  onChange: (e: any) => void
  state: {
    nickname: string
    isUpdatingGameState: boolean
    isDuplicateNickname: boolean
    duplicateNicknameErrorMessage: string
  }
}




const NicknameForm: FC<NicknameFormProps> = ({
  state,
  onSubmit,
  onChange,
}) => {
  return (
    <>
      <form
        className={ styles['input-section'] }
        onSubmit={
          (e: any): Promise<void> => onSubmit(e)
        }
      >
        <h4 className={ styles['input-label'] }>
          { `Enter Nickname` }
        </h4>
        <input
          type='text'
          value={ state.nickname }
          placeholder={ 'Enter a Nickname' }
          className={ styles['input-field'] }
          onChange={ (e: any) => onChange(e) }
          style={ {
            borderColor: state.isDuplicateNickname
              ? 'rgb(243, 0, 0)'
              : '',
          } }
        />

        { state.isDuplicateNickname && (
          <>
            <div className={ styles['error-message'] }>
              <div>
                { `${
                    state.duplicateNicknameErrorMessage.slice(
                      0,
                      state.duplicateNicknameErrorMessage.indexOf('!') + 1
                    )
                  }`
                }
              </div>
              <div>
                {
                  state.duplicateNicknameErrorMessage.slice(
                    state.duplicateNicknameErrorMessage.indexOf('!') + 1
                  )
                }
              </div>
            </div>
          </>
        ) }

        { state.isUpdatingGameState ? (
          <>
            <div
              style={ {
                ...definitelyCenteredStyle,
                position: 'relative',
                top: '5px',
              } }
            >
              <Spinner height='30' width='30' />
            </div>
          </>
        ) : (
          <button
            type={ 'submit' }
            className={ styles['input-button'] }
          >
            { `Join` }
          </button>
        ) }
      </form>
    </>
  )
}


export default NicknameForm
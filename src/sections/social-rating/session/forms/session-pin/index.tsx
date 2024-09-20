// Externals
import { FC } from 'react'
// Locals
import styles from '@/sections/social-rating/session/GameSession.module.css'



type SessionPinFormProps = {
  onSubmit: (e: any) => Promise<void>
  state: {
    sessionPinInput: string
    isInvalidSessionPin: boolean
  }
  inputHandlers: {
    onSessionPinPaste: (e: any) => void
    onSessionPinChange: (e: any) => void
    onSessionPinKeyDown: (e: any) => void
  }
}



const SessionPinForm: FC<SessionPinFormProps> = ({
  state,
  onSubmit,
  inputHandlers,
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
          { `Enter Session PIN` }
        </h4>
        <input
          type={ 'text' }
          maxLength={ 6 }
          inputMode={ 'numeric' }
          value={ state.sessionPinInput }
          placeholder={ 'Enter 6-digit PIN' }
          className={ styles['input-field'] }
          onPaste={ (e: any): void => inputHandlers.onSessionPinPaste(e) }
          onChange={ (e: any): void => inputHandlers.onSessionPinChange(e) }
          onKeyDown={ (e: any): any => inputHandlers.onSessionPinKeyDown(e) }
          style={ {
            borderColor: state.isInvalidSessionPin
              ? 'rgb(243, 0, 0)'
              : '',
            boxShadow: state.isInvalidSessionPin
              ? '0 2px 6px 3px rgb(243, 0, 0, 0.15)'
              : ''
          } }
        />
        <button
          type={ 'submit' }
          disabled={ state.isInvalidSessionPin }
          className={
            state.isInvalidSessionPin
              ? styles['input-button-disabled']
              : styles['input-button']
          }
        >
          { `Enter PIN` }
        </button>
      </form>
    </>
  )
}

export default SessionPinForm
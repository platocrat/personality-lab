// Externals
import { Dispatch, FC, SetStateAction } from 'react'
// Locals
import sectionStyles from '@/sections/invite/StudyInviteSection.module.css'



type InviteRegistrationFormProps = {
  onSubmit: (e: any) => void
  state: {
    participantEmail: string
    participantUsername: string
    setParticipantEmail: Dispatch<SetStateAction<string>>
    setParticipantUsername: Dispatch<SetStateAction<string>>
  }
}


const InviteRegistrationForm: FC<InviteRegistrationFormProps> = ({
  state,
  onSubmit,
}) => {
  return (
    <>
      <form onSubmit={ onSubmit }>
        <label>
          { `Enter your username and email to register as a participant:` }
          <input
            required
            type='email'
            value={ state.participantEmail }
            className={ sectionStyles.first }
            placeholder={ 'janedoe@gmail.com' }
            onChange={ (e) => state.setParticipantEmail(e.target.value) }
          />
        </label>
        <label>
          <input
            required
            type='text'
            placeholder={ 'janedoe' }
            className={ sectionStyles.last }
            value={ state.participantUsername }
            onChange={ (e) => state.setParticipantUsername(e.target.value) }
          />
        </label>
        <button type='submit'>
          { `Register` }
        </button>
      </form>
    </>
  )
}

export default InviteRegistrationForm